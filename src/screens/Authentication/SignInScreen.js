import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {AuthSession} from 'expo';
import {Button, Headline} from "react-native-paper";
import ENV from "../../utilities/Environment.js"
import jwtDecode from 'jwt-decode';
import CurrentUserProvider from "../../utilities/CurrentUserProvider";
import ApiClient from "../../utilities/ApiClient";
import ResponseMapper from "../../utilities/ResponseMapper";
import {handleAndroidBackButton, removeAndroidBackButtonHandler} from "../../components/BackHandler";
import Colors from "../../constants/Colors";

function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    handleAndroidBackButton(() => this.props.navigation.navigate('App'));
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler();
  }

  _signInAsync = async (values) => {
    await CurrentUserProvider.saveUser(values);
    this.props.navigation.navigate('App');
  };

  login = async () => {
    this.performLogin()
      .catch(error => {
        console.log("Caught sign in error. Unlocking go back button", error)
        this.setState({
          loading: false
        })
      })
  };

  performLogin = async () => {
    this.setState({
      loading: true,
    });
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log("Redirect url for auth", redirectUrl);
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
      return this._signInAsync({...userAttributes, ...ResponseMapper.me(json)});
    }).catch(error => {
      console.log("Get /v1/me failed so let's try and create the user", error);
      return apiClient.post('/v1/users/', {data: {display_name: userAttributes.name}})
        .then(json => {
          console.log("Create user response", json);
          return this._signInAsync({...userAttributes, ...ResponseMapper.me(json)});
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
      <ImageBackground
        source={require('../../../assets/images/LoginScreenV1.png')}
        style={styles.imageBackgroundComponent}
        imageStyle={styles.backgroundImageStyle}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Headline style={styles.headline}>Please sign in!</Headline>
            <Button
              color={Colors.turquoise}
              loading={this.state.loading}
              disabled={this.state.loading}
              style={styles.button}
              onPress={this.login}
              mode={'contained'}>Sign Up/Log in!</Button>
            <Button
              color={Colors.turquoise}
              disabled={this.state.loading}
              style={styles.secondButton}
              onPress={this.goBack}
              mode={'outlined'}>Go Back</Button>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgb(255,255,255)',
    elevation: 6
  },
  headline: {
    marginBottom: 20
  },
  imageBackgroundComponent: {
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    // resizeMode: 'center',
  },
  button: {
    marginBottom: 20,
    width: 200
  },
  secondButton: {
    backgroundColor: '#fff',
    width: 200
  }

});


export default SignInScreen;