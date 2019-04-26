import React from 'react';
import {AsyncStorage, ImageBackground, StyleSheet, View} from 'react-native';
import {Facebook} from 'expo';
import {Auth} from 'aws-amplify';
import {Button, Headline} from "react-native-paper";

class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };

  signIn = async () => {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync('312632222603423', {
      permissions: ['public_profile', 'email'],
    });
    console.log("all responses", type, token, expires, permissions, declinedPermissions);
    if (type === 'success') {
      fetch(`https://graph.facebook.com/me?access_token=${token}`)
        .then(response => response.json())
        .then(json => {
          console.log('Logged in!', `Hi ${json.name}!`);
          // sign in with federated identity
          Auth.federatedSignIn('facebook',
            {token, expires_at: expires},
            {name: json.name, email: json.email})
            .then(credentials => {
              console.log('get aws credentials', credentials);
              this.props.navigation.navigate('App');
            })
            .catch(error => console.log("Error doing federatedSignIn", error));
        })
        .catch(error => console.log("Error getting me from facebook", error));

    }
  };

  goBack = () => {
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <ImageBackground source={require('../../../assets/images/PinsterRaccoon.png')} style={styles.imageBackground}>
        <View style={styles.container}>
          <Headline>Please sign in!</Headline>
          <Button onPress={this.signIn} mode={'contained'}>Log in with Facebook</Button>
          <Button onPress={this.goBack}>Go Back</Button>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  }

});


export default SignInScreen;