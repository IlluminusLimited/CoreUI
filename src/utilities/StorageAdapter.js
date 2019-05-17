import React from 'react';
import {AsyncStorage} from "react-native";

class StorageAdapter {
  static load = async (paramsList) => {
    return AsyncStorage.multiGet(paramsList).then(values => {
      return values.reduce((memo, current) => {
        memo[current[0]] = current[1];
        return memo;
      }, {});
    })
  };

  static save = async (params, keyList) => {
    const valuesToSave = keyList.map((key) => {
      return [key.toString(), params[key] ? params[key].toString() : '']
    });
    console.debug("Values to save to AsyncStorage: ", valuesToSave);

    return AsyncStorage.multiSet(valuesToSave);
  };

  static saveJson = async (keyName, object) => {
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