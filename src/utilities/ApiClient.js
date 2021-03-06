import React from "react";
import ENV from "./Environment";


function handleErrors(error) {
  console.error("Api level error: ", error);
  throw error;
}

function handleResponse(response) {
  if (!response.ok) {
    console.warn("Response was not successful.", response);
    throw response;
  }
  return response;
}

function extractJson(response) {
  console.debug(`END: '${response.url}' Status: ${response.status}`);
  return response.text().then((text) => {
    return text ? JSON.parse(text) : {}
  });
}

//If we get a 401 and our token was sent then we know the API doesn't know about this user yet so we must
//POST to the /users endpoint <-- This should never happen except on the first hit to /me
//If this happens and we aren't hitting /me then something's fucked.

//On a normal request, if we get a 403 with the message: "Signature has expired"
//then we know to use the refresh token to get a new token

//if we get a 403 with the message "You are not authorized to perform this action"
//then we know the user is trying to do something they aren't allowed to do and this should be a bug
//because we shouldn't show UI elements for things they can't do.

//If we get a 422 then we know something was malformed with the request and this is a bug
//with either the client or the API.


class ApiClient {
  constructor(currentUser = {}) {
    this.currentUser = currentUser;
  }

  get = async (pathOrUrl) => {
    const url = this.pathToUrl(pathOrUrl);
    const retryHandler = this.buildRetryHandler(url);
    console.debug("GET:", url);
    return fetch(url, this.authify())
      .catch(handleErrors)
      .then(handleResponse)
      .catch(retryHandler)
      .then(extractJson)
  };

  //TODO: If a request gets a 422 and extractJSON doesn't blowup
  //then the response is simply returned. It would be nice to be able to register
  //response handlers and influence whether to throw or continue on non success statuses.
  post = async (pathOrUrl, body = {}) => {
    const url = this.pathToUrl(pathOrUrl);

    const paramsNoAuth = {
      method: 'POST',
      body: JSON.stringify(body)
    };

    const retryHandler = this.buildRetryHandler(url, paramsNoAuth);
    console.debug("POST:", url);
    return fetch(url, this.authify(paramsNoAuth))
      .catch(handleErrors)
      .then(handleResponse)
      .catch(retryHandler)
      .then(extractJson)
  };

  patch = async (pathOrUrl, body = {}) => {
    const url = this.pathToUrl(pathOrUrl);

    const paramsNoAuth = {
      method: 'PATCH',
      body: JSON.stringify(body)
    };

    const retryHandler = this.buildRetryHandler(url, paramsNoAuth);
    console.debug("PATCH:", url);
    return fetch(url, this.authify(paramsNoAuth))
      .catch(handleErrors)
      .then(handleResponse)
      .catch(retryHandler)
      .then(extractJson)
  };

  delete = async (pathOrUrl) => {
    const url = this.pathToUrl(pathOrUrl);

    const paramsNoAuth = {method: 'DELETE'};

    const retryHandler = this.buildRetryHandler(url, paramsNoAuth);

    console.debug("DELETE:", url);
    return fetch(url, this.authify(paramsNoAuth))
      .catch(handleErrors)
      .then(handleResponse)
      .catch(retryHandler)
      .then(extractJson)
  };


  pathToUrl = (rawPath) => {
    if (!rawPath) {
      throw Error("Cannot make api call without url or path!");
    }
    let path = rawPath;
    if (rawPath.includes(":user_id")) {
      if (this.currentUser.userId) {
        path = rawPath.replace(":user_id", this.currentUser.userId);
      }
      else {
        throw new Error("ApiClient cannot make requests involving userId without a currentUser that has a userId!")
      }
    }

    if (path.includes(ENV.API_URI)) {
      return path;
    }
    return `${ENV.API_URI}${path}`;
  };

  authify = (params = {}, authToken = this.currentUser.authToken) => {
    return {...this.buildHeaders(authToken), ...params}
  };

  buildHeaders = (token = this.currentUser.authToken) => {
    if (token) {
      return {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      }
    }
    console.debug("Token was not passed in. Not adding Authorization header.");
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  };

  buildRetryHandler = (url, paramsNoAuth = {}) => {
    return (response) => {
      try {
        return extractJson(response).then(json => {
            if (response.status === 403 && json && json.message === "Signature has expired") {
              console.info("Caught 403 for expired signature. Refreshing token and retrying.");
              return this.currentUser.refreshAuthToken().then(authToken => {
                return fetch(url, this.authify(paramsNoAuth, authToken))
              });
            }
          }
        );

      } catch (err) {
        console.debug("Failed to refresh authToken", err);
        throw err;
      }
      console.warn("Retry handler could not handle response. Throwing!");
      throw response;
    }
  }
}

export default ApiClient;