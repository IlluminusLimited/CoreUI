import React from 'react';
import {AsyncStorage} from "react-native";

class StorageAdapter {
  static async load(paramsList) {
    return AsyncStorage.multiGet(paramsList).then((values) => {
      return values.reduce((memo, current) => {
        memo[current[0]] = current[1];
        return memo;
      }, {});
    })
  }

  static async save(params, keyList) {
    const valuesToSave = keyList.map((key) => {
      return [key.toString(), params[key] ? params[key].toString() : '']
    });
    console.debug("Values to save to AsyncStorage: ", valuesToSave);

    return AsyncStorage.multiSet(valuesToSave);
  }
}

export default StorageAdapter;