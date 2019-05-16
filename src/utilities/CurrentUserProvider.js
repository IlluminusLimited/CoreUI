import React from 'react';
import {AsyncStorage} from "react-native";
import TokenProvider from "./TokenProvider";
import CurrentUser from "./CurrentUser";
import {SecureStore} from "expo";
import ResponseMapper from "./ResponseMapper";
import ApiClient from "./ApiClient";

class CurrentUserProvider {
  static async loadUser() {
    return Promise.all([
        AsyncStorage.multiGet(ResponseMapper.asyncStorageUserParams()),
        TokenProvider.authToken(),
        TokenProvider.refreshToken()
      ]
    ).then((values) => {
      const user = values[0].reduce((memo, current) => {
        memo[current[0]] = current[1];
        return memo;
      }, {});
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

  static
  async saveUser(params) {
    console.log("Got user params", params);

    const valuesToSave = ResponseMapper.asyncStorageUserParams().map((key) => {
      return [key.toString(), params[key] ? params[key].toString() : '']
    });
    console.debug("Values to save: ", valuesToSave);

    await Promise.all([
      SecureStore.setItemAsync('authToken', params.authToken),
      SecureStore.setItemAsync('refreshToken', params.refreshToken),
      AsyncStorage.multiSet(valuesToSave)
    ]);

    return await CurrentUserProvider.loadUser();
  }


  static async getApiClient() {
    return new ApiClient(await this.loadUser());
  }
}

export default CurrentUserProvider;