import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import ApiClient from "./ApiClient";
import { SecureStore } from 'expo';

const storage = new Storage({
  // maximum capacity, default 1000
  size: 1000,

  // Use AsyncStorage for RN apps, or window.localStorage for web apps.
  // If storageBackend is not set, data will be lost after reload.
  storageBackend: AsyncStorage,

  // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: 1000 * 3600 * 24,

  // cache data in the memory. default is true.
  enableCache: true,

  // if data was not found in storage or expired data was found,
  // the corresponding sync method will be invoked returning
  // the latest data.
  sync: {
    // The name of the sync method must be the same as the data's key name
    // And the passed params will be an all-in-one object.
    // You can return a value or a promise here
    async user(params) {
      new ApiClient().get("/me", (error) => {console.error(error)})
        .then(json => {
        storage.save({
          key: 'user',
          data: {
            userId: json.id,
            name: json.display_name
          }
        })
      })

      const responseText = await response.json();
      console.log(`user${id} sync resp: `, responseText);
      const json = JSON.parse(responseText);
      if (json && json.user) {
        storage.save({
          key: 'user',
          id,
          data: json.user
        });
        if (someFlag) {
          // do something for some custom flag
        }
        // return required data when succeed
        return json.user;
      }
      else {
        // throw error when failed
        throw new Error(`error syncing user${id}`);
      }
    },

    async authToken(params) {
      const storedToken = await SecureStore.getItemAsync('authToken');

      if(!storedToken) {
        await SecureStore.getItemAsync('refreshToken');
      }

      if (storedToken) {
        storage.save({
          key: 'authToken',
          data: storedToken,
          expires: 1000 * 60
        });

        return storedToken;
      }
      else {
        // throw error when failed
        throw new Error(`Error getting authToken from storage.`);
      }
    }
  }
});

global.storage = storage;