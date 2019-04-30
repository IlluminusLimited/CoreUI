import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View} from 'react-native';
import {Avatar, Subheading} from "react-native-paper";

export default class Profile extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: "My Profile"
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
  }

  componentDidMount() {
    this._loadUser();
  }

  _loadUser = async () => {
    AsyncStorage.multiGet(['name', 'picture']).then(results => {
      const user = results.reduce((memo, current) => {
        memo[current[0]] = current[1];
        return memo;
      }, {})
      if (!user) {
        console.log("No user found. Redirecting to auth");
        return this.props.navigation.navigate('Auth');
      }
      user['email'] = "dummy@email.com";
      console.log("user:", user);
      this.setState({currentUser: user});
    }).catch(error => {
      console.error("Failed to get from async storage", error)
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Avatar.Image source={{uri: this.state.currentUser.picture}} size={64} />
          <Text>{this.state.currentUser ? this.state.currentUser.name : ''}</Text>
          <View style={styles.userAttribute}>
            <Subheading>Email: </Subheading>
            <Text>{this.state.currentUser ? this.state.currentUser.email : ''}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20
  },
  userInfo: {
    marginTop: 35,
    flex: 1,
    alignItems: 'center'
  },
  userAttribute: {
    flex: 1,

  },
  // image: {
  //   height: 100,
  //   width: 100,
  // }
});
