import React from 'react';
import {AsyncStorage, ScrollView, StyleSheet, View} from "react-native";
import {withNavigation} from "react-navigation";

import {Subheading, Text} from "react-native-paper";

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