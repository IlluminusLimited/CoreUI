import React from 'react';
import {AsyncStorage, Button, View} from "react-native";

export default class Settings extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('App');
  };

  _goHome = async () => {
    this.props.navigation.navigate('App')
  };

  _signIn = async () => {
    this.props.navigation.navigate('Auth')
  };

  render() {
    return (
      <View>
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
        <Button title="go somewhere" onPress={this._goHome} />
        <Button title="Sign in" onPress={this._signIn} />
      </View>
  )
  }
}