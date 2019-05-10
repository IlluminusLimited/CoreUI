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
  console.log("Got response:", response);
  return response.json().then(json => {
    return json;
  });
}


class ApiClient {
  get = async (raw_url, noAuthTokenHandler) => {
    const url = await this.handleRawPath(raw_url, noAuthTokenHandler);
    return fetch(url, {
      headers: this.buildAuthHeader(noAuthTokenHandler)
    }).then(handleErrors)
      .then(extractJson)
  };

  post = async (raw_url, body, noAuthTokenHandler) => {
    const url = await this.handleRawPath(raw_url, noAuthTokenHandler);

    return fetch(url, {
      headers: this.buildAuthHeader(noAuthTokenHandler),
      method: 'POST',
      body: JSON.stringify(body)
    }).then(handleErrors)
      .then(extractJson)
  };


  buildAuthHeader = async (noAuthTokenHandler) => {
    return {
      Authorization: 'Bearer ' + await this.authToken(noAuthTokenHandler),
      'content-type': 'application/json'
    }
  };

  handleRawPath = async (raw_path, noAuthTokenHandler) => {
    let path = raw_path;
    if (raw_path.includes(":user_id")) {
      const realId = await this.userId(noAuthTokenHandler);
      path = raw_path.replace(":user_id", realId);
    }
    return path;
  };


  authToken = async (noAuthTokenHandler) => {
    return AsyncStorage.getItem('authToken').then(authToken => {
      if (authToken) {
        return authToken;
      }
      return noAuthTokenHandler("No authToken found");
    });
  };


  userId = async (noAuthTokenHandler) => {
    return AsyncStorage.getItem('userId').then(userId => {
      if (userId) {
        return userId;
      }
      console.log("userId was not set. Fetching /me");
      return this.get("/me", noAuthTokenHandler).then(json => {
        AsyncStorage.setItem({userId: json.id});
        return json.id;
      })
    });
  };
}

export default ApiClient;