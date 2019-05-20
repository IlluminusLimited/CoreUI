import React from 'react';
import {StatusBar, StyleSheet, View,} from 'react-native';
import CurrentUserProvider from "../../utilities/CurrentUserProvider";
import LoadingSpinner from "../../components/LoadingSpinner";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    CurrentUserProvider.getUser(this);
  }

// Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
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
    marginVertical: 35
  },
  contentContainer: {
    paddingTop: 10
  },
});


export default AuthLoadingScreen;