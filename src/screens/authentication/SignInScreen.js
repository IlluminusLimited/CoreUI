import React from 'react';
import {AsyncStorage, ScrollView, StyleSheet, View} from 'react-native';
import {
  Authenticator,
  ConfirmSignIn,
  ConfirmSignUp,
  ForgotPassword,
  Greetings,
  RequireNewPassword,
  SignIn,
  SignUp,
  VerifyContact
} from "aws-amplify-react-native";
import aws_exports from "../../aws-exports";
import {Facebook} from 'expo';
import {Auth} from 'aws-amplify';
import {Button} from "react-native-paper";

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
    console.log("all responsees", type, token, expires, permissions, declinedPermissions);
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


  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <Button onPress={this.signIn}>Log in with Facebook</Button>
        </View>
        <Authenticator
          // Optionally hard-code an initial state
          authState={"signIn"}
          // Pass in an already authenticated CognitoUser or FederatedUser object
          authData={'username'}
          // Fired when Authentication State changes
          onStateChange={(authState) => console.log(authState)}
          // A theme object to override the UI / styling
          // Hide specific components within the Authenticator
          hide={
            [
              Greetings,
              SignIn,
              ConfirmSignIn,
              RequireNewPassword,
              SignUp,
              ConfirmSignUp,
              VerifyContact,
              ForgotPassword
            ]
          }
          // or hide all the default components
          hideDefault={true}
          // Pass in an aws-exports configuration
          amplifyConfig={aws_exports}
          // Pass in a message map for error strings
        >
          {/*// Default components can be customized/passed in as child components.*/}
          {/*// Define them here if you used hideDefault={true}*/}
          <Greetings />
          <SignIn />
          <ConfirmSignIn />
          <RequireNewPassword />
          <SignUp />
          <ConfirmSignUp />
          <VerifyContact />
          <ForgotPassword />
        </Authenticator>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
  contentContainer: {
    flex: 1
  },
});


export default SignInScreen;