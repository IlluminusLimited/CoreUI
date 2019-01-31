import React from 'react';
import {AsyncStorage, Button, StyleSheet, View} from "react-native";
import {withNavigation} from "react-navigation";

class Settings extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _goHome = async () => {
    this.props.navigation.navigate('Home')
  };

  _signIn = async () => {
    this.props.navigation.navigate('Auth')
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
        <Button title="Go Home" onPress={this._goHome} />
        <Button title="Sign in" onPress={this._signIn} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35
  },
});

export default withNavigation(Settings);