import {AsyncStorage} from "react-native";
import React from "react";

function handleErrors(response) {
  if (!response.ok) {
    console.warn("Response was not successful.", response);
    throw Error(`Error: ${response.status}. statusText: ${response.statusText}. Url: ${response.url}`);
  }
  return response;
}

function extractJson(response) {
  console.debug(`Request to url: ${response.url} was ok? ${response.ok}. Status: ${response.status}`);
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
  get = async (raw_url) => {
    const url = await this.handleRawPath(raw_url);
    return fetch(url, {
      headers: await this.buildAuthHeader()
    }).then(handleErrors)
      .then(extractJson)
  };

  post = async (raw_url, body) => {
    const url = await this.handleRawPath(raw_url);

    return fetch(url, {
      headers: this.buildAuthHeader(),
      method: 'POST',
      body: JSON.stringify(body)
    }).then(handleErrors)
      .then(extractJson)
  };


  buildAuthHeader = async () => {
    return {
      Authorization: 'Bearer ' + await tokenProvider.authToken(),
      'content-type': 'application/json'
    }
  };

  handleRawPath = async (raw_path ) => {
    let path = raw_path;
    if (raw_path.includes(":user_id")) {
      const realId = await storage.load({key: 'user', syncInBackground: false}).then(user => {return user.userId});
      path = raw_path.replace(":user_id", realId);
    }
    return path;
  };
}

export default ApiClient;