import TokenProvider from "./TokenProvider";
import {AsyncStorage} from "react-native";
import jwtDecode from 'jwt-decode';
import ApiClient from "./ApiClient";
import ResponseMapper from "./ResponseMapper";

class CurrentUser {
  static async logOut() {
    console.log("Logging out user");
    return TokenProvider.logOut().then(AsyncStorage.clear);
  };

  constructor(provider, params = {}) {
    ResponseMapper.allUserParams().forEach(item => {
      this[item] = params[item];
    });
    this.permissions = this.authToken ? jwtDecode(this.authToken).permissions : [];
    this.currentUserProvider = provider;
  }

  isLoggedIn() {
    return !!this.authToken;
  }

  getApiClient() {
    return new ApiClient(this);
  }

 async getFavoriteCollectionId() {
    if (this.favoriteCollectionId) {
      return this.favoriteCollectionId
    }

    const apiClient = this.getApiClient();
    console.log("No favorite collection found. Attempting to look it up.");

    let favoritesCollection = await apiClient.get(this.userCollectionsSummaryUrl)
      .then(json => {
        return json.find(item => {
          return item.name === "Favorites";
        });
      });


    if (favoritesCollection) {
      console.log("Found favorite collection!", favoritesCollection);
      this.favoriteCollectionId = favoritesCollection.id;
      this.currentUserProvider.saveUser(this);
      return this.favoriteCollectionId;
    }

    console.log("No favorites collection found. Creating one.");
    return apiClient.post(this.userCollectionsUrl, {
      data: {
        name: "Favorites",
        description: "All my favorite pins!"
      }
    }).then(json => {
      console.log("Generated favorite collection!", json);
      this.favoriteCollectionId = json.id;
      this.currentUserProvider.saveUser(this);
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