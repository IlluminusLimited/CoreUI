import React from 'react';
import {AsyncStorage} from "react-native";

class StorageAdapter {
  static load = async (keys) => {
    return AsyncStorage.multiGet(keys).then(values => {
      return values.reduce((memo, current) => {
        memo[current[0]] = current[1];
        return memo;
      }, {});
    })
  };

  static save = async (keysToSave, params) => {
    const valuesToSave = keysToSave.map((key) => {
      return [key.toString(), params[key] ? params[key].toString() : '']
    });
    console.debug("Values to save to AsyncStorage: ", valuesToSave);

    return AsyncStorage.multiSet(valuesToSave);
  };

  static saveJson = async (keyName, object) => {
    console.debug(`Save json for key: ${keyName}`, object);
    return AsyncStorage.setItem(keyName, JSON.stringify(object))
      .then(() => object);
  };

  static loadJson = async (keyName) => {
    const returnedItem = await AsyncStorage.getItem(keyName);
    if (returnedItem) {
      return await JSON.parse(returnedItem);
    }
    console.debug(`Failed to loadJson for key: ${keyName}`);
    return null;
  }
}

export default StorageAdapter;