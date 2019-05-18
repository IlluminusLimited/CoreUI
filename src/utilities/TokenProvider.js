import {SecureStore} from 'expo';
import ENV from "./Environment";

class TokenProvider {

  static logOut = async () => {
    SecureStore.deleteItemAsync('authToken');
    SecureStore.deleteItemAsync('refreshToken');
  };

  static authToken = async () => {
    const storedToken = await SecureStore.getItemAsync('authToken');

    if (storedToken) {
      return storedToken;
    }
    console.debug("No stored authToken. Refreshing.");
    const authToken = await TokenProvider.refreshAuthToken();

    if (authToken) {
      return authToken;
    }

    throw new Error(`Error getting authToken from storage.`);
  };

  static refreshToken = async () => {
    const storedToken = await SecureStore.getItemAsync('refreshToken');

    if (storedToken) {
      return storedToken;
    }

    throw new Error("No refreshToken found. There is no authenticated user.");
  };

  static refreshAuthToken = async (refreshTokenParam) => {
    let refreshToken = refreshTokenParam;
    if (!refreshToken) {
      refreshToken = await this.refreshToken();
    }

    if (refreshToken) {
      console.log("Refreshing authToken with refreshToken");
      const body = {
        grant_type: "refresh_token",
        client_id: ENV.AUTH0_KEY,
        refresh_token: refreshToken
      };
      const resp = await fetch(`${ENV.AUTH0_SITE}/oauth/token`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      });
      console.log("Auth0 refreshToken response", resp);

      if (resp && resp.ok) {
        const json = await resp.json();
        console.log("Auth0 refreshToken json", json);
        return SecureStore.setItemAsync('authToken', json.access_token).then(() => {
          return json.access_token
        });
      }
      throw new Error("Failed to get authToken with refreshToken.");
    }

    throw new Error("No refreshToken found. There is no authenticated user.")
  }
}

export default TokenProvider;