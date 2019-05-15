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
          ...user,
          authToken
        });
      }).catch(error => {
        console.log("Failed to load authToken. No user found.", error);
        return new CurrentUser();
      })
    })
  }

  static async saveUser(params) {
    console.log("Got user params", params);

    const valuesToSave = CurrentUser.asyncStorageUserParams().map((key) => {
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
}

export default CurrentUserProvider;