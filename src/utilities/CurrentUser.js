import TokenProvider from "./TokenProvider";
import {AsyncStorage} from "react-native";
import jwtDecode from 'jwt-decode';

class CurrentUser {
  static asyncStorageUserParams() {
    return ['name', 'picture', 'email', 'userId'];
  }

  static allUserParams() {
    return ['authToken', ...this.asyncStorageUserParams()]
  }

  static async logOut() {
    console.log("Logging out user");
    return TokenProvider.logOut().then(AsyncStorage.clear);
  };

  constructor(params = {}) {
    CurrentUser.allUserParams().forEach(item => {
      this[item] = params[item];
    });
    this.permissions = this.authToken ? jwtDecode(this.authToken).permissions : [];
  }

  isLoggedIn() {
    return !!this.authToken;
  }

  can(permission) {
    return this.permissions.some(item => item === permission);
  }

  async refreshAuthToken() {
    console.log("Refreshing authToken");
    return TokenProvider.refreshAuthToken()
      .then((authToken) => {
        this.authToken = authToken;
        return this.authToken;
      })
  };
}


export default CurrentUser;