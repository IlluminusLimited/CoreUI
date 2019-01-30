import React from 'react';
import {AsyncStorage, Button} from "react-native";

export default class Settings extends React.Component {


  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <Button title="Actually, sign me out :)" onPress={this._signOutAsync.bind(this)} />
    )
  }
}
