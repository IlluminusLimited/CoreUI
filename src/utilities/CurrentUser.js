import TokenProvider from "./TokenProvider";
import {AsyncStorage} from "react-native";
import jwtDecode from 'jwt-decode';

class CurrentUser {
  static asyncStorageUserParams() {
    return ['name', 'picture', 'email', 'userId'];
  }

  constructor(params = {}) {
    this.name = params.name;
    this.picture = params.picture ? params.picture : require('../../assets/images/BrokenImage_200x200.png');
    this.authToken = params.authToken;
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

  async logOut() {
    console.log("Logging out user");
    return TokenProvider.logOut().then(AsyncStorage.clear);
  };
}


export default CurrentUser;