import TokenProvider from "./TokenProvider";
import {AsyncStorage} from "react-native";
import jwtDecode from 'jwt-decode';
import ApiClient from "./ApiClient";
import CurrentUserProvider from "./CurrentUserProvider";

class CurrentUser {
  static asyncStorageUserParams() {
    return ['name', 'picture', 'email', 'userId', 'favoriteCollectionId'];
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

  getFavoriteCollectionId() {
    if (this.favoriteCollectionId) {
      return this.favoriteCollectionId
    }

    const apiClient = new ApiClient(this.authToken);
    console.log("No favorite collection found. Attempting to look it up.");

    let favoritesCollection = apiClient.get(`/v1/users/${this.userId}/collections/summary`)
      .then(json => {
        return json.find(item => {
          return item.name === "Favorites";
        });
      });


    if (favoritesCollection) {
      console.log("Found favorite collection!", favoritesCollection);
      this.favoriteCollectionId = favoritesCollection.id;
      CurrentUserProvider.saveUser({...this});
      return this.favoriteCollectionId;
    }

    console.log("No favorites collection found. Creating one.");
    apiClient.post(`/v1/users/${this.userId}/collections`, {
      data: {
        name: "Favorites",
        description: "All my favorite pins!"
      }
    }).then(json => {
      console.log("Generated favorite collection!", json);
      this.favoriteCollectionId = json.id;
      CurrentUserProvider.saveUser({...this});
      return this.favoriteCollectionId;
    })
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