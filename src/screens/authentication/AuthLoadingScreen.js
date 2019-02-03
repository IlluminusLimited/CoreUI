import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Auth} from "aws-amplify";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._loadUser();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _loadUser = async () => {
    await Auth.currentAuthenticatedUser()
      .then(currentUser => {
        console.log("CurrentUser:", currentUser);
        this.setState({currentUser: currentUser});
        this.props.navigation.navigate('App');
      })
      .catch(error => {
        console.log("No authenticated user: ", error);
        this.props.navigation.navigate('Auth');
      });
  };

// Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 10
  },
});


export default AuthLoadingScreen;