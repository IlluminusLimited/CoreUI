import React from 'react';
import {AsyncStorage} from "react-native";
import TokenProvider from "./TokenProvider";
import CurrentUser from "./CurrentUser";
import {SecureStore} from "expo";

class CurrentUserProvider {
  static async loadUser() {
    return AsyncStorage.multiGet(CurrentUser.asyncStorageUserParams()).then(results => {
      return TokenProvider.authToken().then(authToken => {
        const user = results.reduce((memo, current) => {
          memo[current[0]] = current[1];
          return memo;
        }, {});
        return new CurrentUser({
          user,
          authToken,
        });
      }).catch(error => {
        console.log("Failed to load authToken. No user found.", error);
        return new CurrentUser();
      })
    })
  }

  static async saveUser(params) {
    console.log("Got user params", params);

    const asyncStorageParams = {};
    CurrentUser.asyncStorageUserParams().forEach(item => {
      asyncStorageParams[item] = params[item];
    });

    const valuesToSave = Object.keys(asyncStorageParams).map((key) => {
      return [key.toString(), asyncStorageParams[key].toString()]
    });

    return Promise.all([
      SecureStore.setItemAsync('authToken', params.authToken),
      SecureStore.setItemAsync('refreshToken', params.refreshToken),
      AsyncStorage.multiSet(valuesToSave)
    ]);
  }
}

export default CurrentUserProvider;