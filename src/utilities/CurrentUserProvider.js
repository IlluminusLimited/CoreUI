import React from 'react';
import TokenProvider from "./TokenProvider";
import CurrentUser from "./CurrentUser";
import {SecureStore} from "expo";
import ResponseMapper from "./ResponseMapper";
import ApiClient from "./ApiClient";
import StorageAdapter from "./StorageAdapter";

class CurrentUserProvider {
  static async loadUser() {
    return Promise.all([
        StorageAdapter.load(ResponseMapper.asyncStorageUserParams()),
        TokenProvider.authToken(),
        TokenProvider.refreshToken()
      ]
    ).then((values) => {
      const user = values[0];
      return new CurrentUser(this, {
        ...user,
        authToken: values[1],
        refreshToken: values[2]
      });
    }).catch(error => {
      console.log("Failed to load authToken. No user found.", error);
      return new CurrentUser(this);
    })
  }

  static async saveUser(params) {
    console.log("Got user params", params);

    await Promise.all([
      SecureStore.setItemAsync('authToken', params.authToken),
      SecureStore.setItemAsync('refreshToken', params.refreshToken),
      StorageAdapter.save(params, ResponseMapper.asyncStorageUserParams())
    ]);

    return await CurrentUserProvider.loadUser();
  }


  static async getApiClient() {
    return new ApiClient(await this.loadUser());
  }
}

export default CurrentUserProvider;