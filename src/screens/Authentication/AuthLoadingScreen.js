import React from 'react';
import {StatusBar, StyleSheet, View,} from 'react-native';
import {ActivityIndicator} from "react-native-paper";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

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
    marginVertical: 35
  },
  contentContainer: {
    paddingTop: 10
  },
});


export default AuthLoadingScreen;