import React from 'react';
import {AsyncStorage} from "react-native";

class CurrentUser {
  static isLoggedIn = async () => {
    return await AsyncStorage.getItem('authToken').then(authToken => !!authToken);
  }
}


export default CurrentUser;