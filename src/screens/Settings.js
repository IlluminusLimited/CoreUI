import React from 'react';
import {AsyncStorage, Button, ScrollView, StyleSheet, View} from "react-native";
import {withNavigation} from "react-navigation";
import {Auth} from 'aws-amplify';
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

import aws_exports from '../aws-exports';
import {Subheading, Text, Title} from "react-native-paper";

class Settings extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      // title: 'Settings',
      header: null,
    };
  };

  state = {
    loaded: false,
    userId: this.props.userId,
    collections: [],
    currentUser: {}
  };

  constructor(props) {
    super(props);
    this._loadUser();
  }


  _loadUser = async () => {
    await Auth.currentAuthenticatedUser()
      .then(currentUser => {
        console.log("CurrentUser:", currentUser);
        this.setState({currentUser: currentUser})
      })
      .catch(error => {
        console.log("No authenticated user: ", error)
        this.props.navigation.navigate('Auth');
      });
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
      <ScrollView style={styles.container}>
        <View style={styles.userInfo}>
          <View style={styles.userAttribute}>
            <Subheading>Name: </Subheading>
            <Text>{this.state.currentUser ? this.state.currentUser.name : ''}</Text>
          </View>
          <View style={styles.userAttribute}>
            <Subheading>Email: </Subheading>
            <Text>{this.state.currentUser ? this.state.currentUser.email : ''}</Text>
          </View>
        </View>
        <Authenticator
          // Optionally hard-code an initial state
          authState={"signIn"}
          // Pass in an already authenticated CognitoUser or FederatedUser object
          authData={'username'}
          // Fired when Authentication State changes
          onStateChange={(authState) => console.log("authStateChange", authState)}
          // An object referencing federation and/or social providers
          // *** Only supported on React/Web (Not React Native) ***
          // For React Native use the API Auth.federatedSignIn()
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
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    userInfo: {
      marginTop: 35,
      flex: 1,
      backgroundColor: 'blue'
    },
    userAttribute: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'purple',
      alignItems: 'center'
    }
  }
);

export default withNavigation(Settings);