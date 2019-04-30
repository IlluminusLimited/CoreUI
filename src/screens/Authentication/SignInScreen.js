import React from 'react';
import {AsyncStorage, ImageBackground, StyleSheet, View} from 'react-native';
import {AuthSession} from 'expo';
import {Button, Headline} from "react-native-paper";
import ENV from "../../utilities/environment.js"
import jwtDecode from 'jwt-decode';

function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _signInAsync = async (values) => {
    await AsyncStorage.multiSet(values);
    this.props.navigation.navigate('App');
  };


  login = async () => {
    // Retrieve the redirect URL, add this to the callback URL list
    // of your Auth0 application.
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log(`Redirect URL: ${redirectUrl}`);

    // Structure the auth parameters and URL
    const queryParams = toQueryString({
      client_id: ENV.AUTH0_KEY,
      redirect_uri: redirectUrl,
      response_type: 'id_token', // id_token will return a JWT token
      scope: 'openid profile email', // retrieve the user's profile
      nonce: 'nonce', // ideally, this will be a random value
    });
    const authUrl = `${ENV.AUTH0_SITE}/authorize` + queryParams;

    // Perform the authentication
    const response = await AuthSession.startAsync({authUrl});
    console.log('Authentication response', response);

    if (response.type === 'success') {
      this.handleResponse(response.params);
    }
  };

  handleResponse = (response) => {
    if (response.error) {
      console.error('Authentication error', response.error_description || 'something went wrong');
      return;
    }

    // Retrieve the JWT token and decode it
    const jwtToken = response.id_token;
    const decoded = jwtDecode(jwtToken);

    const things = Object.keys(decoded).map((key, index) => {
      return [key.toString(), decoded[key].toString()]
    });
    console.log("Decoded token", things);

    this._signInAsync(things);
  };


  goBack = () => {
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <ImageBackground source={require('../../../assets/images/splash.png')} style={styles.imageBackground}>
        <View style={styles.container}>
          <Headline>Please sign in!</Headline>
          <Button onPress={this.login} mode={'contained'}>Log in with Auth0</Button>
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