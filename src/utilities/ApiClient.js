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
  console.log("Get response: ", response);
  return response.json().then(json => {
    return json;
  });
}


class ApiClient {
  get = async (raw_url, authFailure) => {
    const url = await this.handleRawPath(raw_url, authFailure);
    return fetch(url, {
      headers: this.buildAuthHeader(authFailure)
    }).then(handleErrors)
      .then(extractJson)
  };

  post = async (raw_url, body, authFailure) => {
    const url = await this.handleRawPath(raw_url, authFailure);

    return fetch(url, {
      headers: this.buildAuthHeader(authFailure),
      method: 'POST',
      body: JSON.stringify(body)
    }).then(handleErrors)
      .then(extractJson)
  };


  buildAuthHeader = async (authFailure) => {
    return {
      Authorization: 'Bearer ' + await this.authToken(authFailure),
      'content-type': 'application/json'
    }
  };

  handleRawPath = async (raw_path, authFailure) => {
    let path = raw_path;
    if (raw_path.includes(":user_id")) {
      const realId = await this.userId(authFailure);
      path = raw_path.replace(":user_id", realId);
    }
    return path;
  };


  authToken = async (authFailure) => {
    return AsyncStorage.getItem('authToken').then(authToken => {
      if (authToken) {
        return authToken;
      }
      authFailure("No authToken found");
    });
  };


  userId = async (authFailure) => {
    return AsyncStorage.getItem('userId').then(userId => {
      if (userId) {
        return userId;
      }
      console.log("userId was not set. Fetching /me");
      return this.get("/me", authFailure).then(json => {
        AsyncStorage.setItem({userId: json.id});
        return json.id;
      })
    });
  };
}

export default ApiClient;