import {AsyncStorage} from "react-native";
import ENV from "./environment";
import React from "react";


function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function extractJson(response) {
  console.log("Get response: ", response);
  return response.json().then(json => {
    return json;
  });
}


function buildAuthHeader(authFailure) {
  return {
    Authorization: 'Bearer ' + this.authToken(authFailure),
    'content-type': 'application/json'
  }
}

class ApiClient {


  apiGet = async (raw_path, authFailure) => {
    const path = raw_path.replace(":user_id", this.userId());

    return fetch(`${ENV.API_URI}${path}`, {
      headers: buildAuthHeader(authFailure)
    }).then(handleErrors)
      .then(extractJson);
  };

  apiPost = async (path, data, authFailure) => {
    path.replace(":user_id", this.userId());
    return fetch(`${ENV.API_URI}${path}`, {
      headers: buildAuthHeader(),
      method: 'POST',
      body: JSON.stringify(data)
    }).then(handleErrors)
      .then(extractJson);
  };

  authToken = async (authFailure) => {
    AsyncStorage.getItem('authToken').then(authToken => {
      if (authToken) {
        return authToken;
      }
      console.log("No authToken found. Redirecting to Auth");
      authFailure();
    });

  };


  userId = async () => {
    AsyncStorage.getItem('authToken').then(userId => {
      if (userId) {
        return userId;
      }
      this.apiGet("/me")
    });
  };

}

export default ApiClient;