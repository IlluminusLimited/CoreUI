import React from 'react';
import {AsyncStorage, ImageBackground, StyleSheet, View} from 'react-native';
import {AuthSession} from 'expo';
import {Button, Headline} from "react-native-paper";
import ENV from "../../utilities/Environment.js"
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
    const redirectUrl = AuthSession.getRedirectUrl();
    const response = await fetch(`${ENV.API_URI}/tools/crypto_codes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
    });

    //TODO: Show error dialog.
    if (!response.ok) {
      throw new Error("Crypto response was not successful!")
    }

    console.log("Api crypto response:", response);
    const json_response = await response.json();

    const verifier = json_response.code_verifier;
    const challenge = json_response.code_challenge;
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
      throw Error(
        `result.type was ${
          result.type
          } instead of "success", full result was: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    }
    console.log("Got authorize result:", result);

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
    this.handleResponse(await resp.json())
  };

  handleResponse = (response) => {
    if (response.error) {
      //TODO: Show error dialog
      console.error('Authentication error', response.error_description || 'something went wrong');
      return;
    }

    // Retrieve the JWT token and decode it
    const jwtToken = response.id_token;
    const decoded = jwtDecode(jwtToken);

    const valuesToSave = Object.keys(decoded).map((key, index) => {
      return [key.toString(), decoded[key].toString()]
    });

    const authToken = response.access_token;
    const refreshToken = response.refresh_token;

    valuesToSave.push(['refreshToken', refreshToken]);
    valuesToSave.push(['authToken', authToken]);

    console.log("Values to save", valuesToSave);

    console.log("Grabbing userId from the api");
    fetch(`${ENV.API_URI}/v1/users/`, {
      headers: {
        Authorization: 'Bearer ' + authToken,
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        data: {
          display_name: decoded.name
        }
      })
    }).then(response => {
      console.log("Create user response: ", response);
      if (response.ok) {
        response.json()
          .then(json => {
            console.log("Create user response", json);
            valuesToSave.push(['userId', json.data.user_id]);
            console.log("Values to save", valuesToSave);
            this._signInAsync(valuesToSave);
          })
      }
      else {
        console.log("Create user unsuccessful. Fetching /me. Failed create response:", response);

        fetch(`${ENV.API_URI}/v1/me`, {
          headers: {
            Authorization: 'Bearer ' + authToken,
            'content-type': 'application/json'
          }
        }).then(response => {
          console.log("Get me response: ", response);
          if (response.ok) {
            response.json()
              .then(json => {
                console.log("Get me json", json);
                valuesToSave.push(['userId', json.id]);
                console.log("Values to save", valuesToSave);
                this._signInAsync(valuesToSave);
              })
          }
          else {
            throw new Error("Failed to get userId from /v1/me");
          }
        }).catch(error => {
          //TODO show error dialog
          console.error("Getting me failed.", error);
        });
      }
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