import TokenProvider from "./TokenProvider";
import {AsyncStorage} from "react-native";
import jwtDecode from 'jwt-decode';
import ApiClient from "./ApiClient";
import ResponseMapper from "./ResponseMapper";
import StorageAdapter from "./StorageAdapter";

class CurrentUser {
  static logOut = async () => {
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

  isLoggedIn = () => {
    return !!this.authToken;
  };

  getApiClient = () => {
    return new ApiClient(this);
  };

  getFavoriteCollectionId = async () => {
    return await this.getFavoriteCollection().favoriteCollectionId;
  };


  getFavoriteCollection = async () => {
    if (!this.isLoggedIn()) {
      return null;
    }
    const favoriteCollection = await StorageAdapter.loadJson('favoriteCollection');

    if (favoriteCollection && favoriteCollection.id) {
      return favoriteCollection
    }

    const apiClient = this.getApiClient();
    console.log("No favorite collection found. Attempting to look it up.");

    let foundCollection = await apiClient.get(this.userCollectionsUrl)
      .then(json => {
        return json.data.find(item => {
          return item.name === "Favorites";
        });
      });

    if (foundCollection) {
      console.log("Found favorite collection!", foundCollection);
      return StorageAdapter.saveJson('favoriteCollection', foundCollection);
    }

    console.log("No favorites collection found. Creating one.");
    return apiClient.post(this.userCollectionsUrl, {
      data: {
        name: "Favorites",
        description: "All my favorite pins!"
      }
    }).then(json => {
      console.log("Generated favorite collection!", json);
      return StorageAdapter.saveJson('favoriteCollection', json);
    })

  };


  can = async (permission) => {
    return this.permissions.some(item => item === permission);
  };

  refreshAuthToken = () => {
    console.log("Refreshing authToken");
    return TokenProvider.refreshAuthToken(this.refreshToken)
      .then((authToken) => {
        console.log("CurrentUser got this authToken back", authToken);
        this.authToken = authToken;
        return this.authToken;
      })
  };
}


export default CurrentUser;