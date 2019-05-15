import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {AuthSession} from 'expo';
import {Button, Headline} from "react-native-paper";
import ENV from "../../utilities/Environment.js"
import jwtDecode from 'jwt-decode';
import CurrentUserProvider from "../../utilities/CurrentUserProvider";
import ApiClient from "../../utilities/ApiClient";

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
    await CurrentUserProvider.saveUser(values);
    this.props.navigation.navigate('App');
  };


  login = async () => {
    const redirectUrl = AuthSession.getRedirectUrl();

    const cryptoJson = await new ApiClient().post('/tools/crypto_codes').catch(error => {
      //TODO: Show error dialog.
      console.error("Crypto response was not successful!", error);
      throw error;
    });

    const verifier = cryptoJson.code_verifier;
    const challenge = cryptoJson.code_challenge;
    console.log("Verifier and challenge:", verifier, challenge);

    const result = await AuthSession.startAsync({
      authUrl: `${ENV.AUTH0_SITE}/authorize` +
        toQueryString({
          audience: ENV.API_URI,
          client_id: ENV.AUTH0_KEY,
          response_type: "code",
          scope: "openid profile email offline_access",
          code_challenge: challenge,
          code_challenge_method: "S256",
          redirect_uri: redirectUrl
        })
    });

    if (result.type !== "success") {
      //TODO: Show error dialog.
      throw Error(`result.type was ${result.type} instead of "success", full result was: ${JSON.stringify(result, null, 2)}`);
    }

    console.debug("Got authorize result:", result);

    const code = result.params.code;
    const body = {
      grant_type: "authorization_code",
      client_id: ENV.AUTH0_KEY,
      code_verifier: verifier,
      code,
      redirect_uri: redirectUrl
    };
    const resp = await fetch(`${ENV.AUTH0_SITE}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    console.log("Token response:", resp);
    return this.handleResponse(await resp.json())
  };

  handleResponse = (response) => {
    if (response.error) {
      //TODO: Show error dialog
      console.error('Authentication error', response.error_description || 'something went wrong');
      return;
    }

    // Retrieve the JWT token and decode it
    const jwtToken = response.id_token;
    //TODO: Validate signature of id token
    const userAttributes = jwtDecode(jwtToken);

    const authToken = response.access_token;

    userAttributes.refreshToken = response.refresh_token;
    userAttributes.authToken = authToken;

    console.log("Grabbing userId from the api");
    const apiClient = new ApiClient({authToken: authToken});

    return apiClient.get('/v1/me').then(json => {
      userAttributes.userId = json.id;
      return this._signInAsync(userAttributes);
    }).catch(error => {
      console.log("Get /v1/me failed so let's try and create the user", error);
      return apiClient.post('/v1/users/', {data: {display_name: userAttributes.name}})
        .then(json => {
          console.log("Create user response", json);
          userAttributes.userId = json.data.user_id;
          return this._signInAsync(userAttributes);
        }).catch(error => {
          //TODO show error dialog
          console.error("Could not POST to /v1/users.", error);
        })
    });
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