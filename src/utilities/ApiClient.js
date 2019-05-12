import React from "react";
import ENV from "./Environment";


function handleErrors(error) {
  console.error("Api level error: ", error);
  throw error;
}

function handleResponse(response) {
  if (!response.ok) {
    console.warn("Response was not successful.", response);
    throw Error(`Error: ${response.status}. statusText: ${response.statusText}. Url: ${response.url}`);
  }
  return response;
}

function extractJson(response) {
  console.debug(`Request to url: '${response.url}' Status: ${response.status}`);
  return response.json().then(json => {
    return json;
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

    return fetch(url, {
      headers: this.buildAuthHeader()
    }).catch(handleErrors)
      .then(handleResponse)
      .then(extractJson)
  };

  post = async (pathOrUrl, body = {}) => {
    const url = this.pathToUrl(pathOrUrl);

    return fetch(url, {
      headers: this.buildAuthHeader(),
      method: 'POST',
      body: JSON.stringify(body)
    }).catch(handleErrors)
      .then(handleResponse)
      .then(extractJson)
  };

  buildAuthHeader = () => {
    return {
      Authorization: 'Bearer ' + this.currentUser.authToken,
      'content-type': 'application/json'
    }
  };

  pathToUrl = (rawPath) => {
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
}"genious"

export default ApiClient;