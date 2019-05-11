import {SecureStore} from 'expo';
import ENV from "./Environment";

class TokenProvider {

  async authToken(params) {
    const storedToken = await SecureStore.getItemAsync('authToken');

    if (storedToken) {
      return storedToken;
    }

    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    const body = {
      grant_type: "refresh_token",
      client_id: ENV.AUTH0_KEY,
      refresh_token: refreshToken
    };
    const resp = await fetch(`${ENV.AUTH0_SITE}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (resp && resp.success) {
      const json = await resp.json();
      SecureStore.setItemAsync('authToken', json.access_token)
    }



    // throw error when failed
    throw new Error(`Error getting authToken from storage.`);
  }
}

global.storage = storage;