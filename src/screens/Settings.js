import React from 'react';
import {AsyncStorage, Button, StyleSheet, View} from "react-native";
import {withNavigation} from "react-navigation";
import TabBarIcon from "./Profile";
import {
  Authenticator,
  ConfirmSignIn,
  ConfirmSignUp, ForgotPassword,
  Greetings,
  RequireNewPassword,
  SignIn,
  SignUp, VerifyContact
} from "aws-amplify-react-native";

import aws_exports from '../aws-exports';

class Settings extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: 'Settings'
    };
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

        <Authenticator
          // Optionally hard-code an initial state
          authState={"signIn"}
        // Pass in an already authenticated CognitoUser or FederatedUser object
        authData={CognitoUser | 'username'}
        // Fired when Authentication State changes
        onStateChange={(authState) => console.log(authState)}
        // An object referencing federation and/or social providers
        // *** Only supported on React/Web (Not React Native) ***
        // For React Native use the API Auth.federatedSignIn()
        federated={myFederatedConfig}
        // A theme object to override the UI / styling
        theme={myCustomTheme}
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
            ForgotPassword,
            TOTPSetup
          ]
        }
        // or hide all the default components
        hideDefault={true}
        // Pass in an aws-exports configuration
        amplifyConfig={aws_exports}
        // Pass in a message map for error strings
        errorMessage={myMessageMap}
      >
        // Default components can be customized/passed in as child components.
        // Define them here if you used hideDefault={true}
        <Greetings/>
        <SignIn federated={myFederatedConfig}/>
        <ConfirmSignIn/>
        <RequireNewPassword/>
        <SignUp/>
        <ConfirmSignUp/>
        <VerifyContact/>
        <ForgotPassword/>
      </Authenticator>
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