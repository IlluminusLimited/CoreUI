import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Button, Subheading} from "react-native-paper";
import Colors from "../constants/Colors";
import FacebookAvatar from "../components/FacebookAvatar";

export default class Profile extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null
    };
  };

  state = {
    loading: true,
    userId: this.props.userId,
    collections: [],
    picture: '',
    name: '',
    email: '',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._loadUser();
  }

  _loadUser = async () => {
    this.setState({
      loading: true
    });
    //TODO: Extract currentUser stuff into CurrentUserProvider
    AsyncStorage.multiGet(['name', 'picture', 'email', 'userId']).then(results => {
      const user = results.reduce((memo, current) => {
        memo[current[0]] = current[1];
        return memo;
      }, {});
      if (!user.name) {
        console.log("No user found. Redirecting to auth");
        return this.props.navigation.navigate('Auth');
      }
      console.log("user:", user);
      this.setState({
        name: user.name,
        email: user.email,
        picture: user.picture,
        userId: user.userId,
        loading: false
      });

      console.log(this.state.picture)
      ;
    }).catch(error => {
      console.error("Failed to get from async storage", error)
    });
  };

  _logout = async () => {
    await AsyncStorage.clear();
    this.setState({
      name: '',
      email: '',
      picture:'',
      userId: '',
    });
    console.log("Async storage cleared");
    return this.props.navigation.navigate('Auth');
  };

  _edit = async () => {
    await AsyncStorage.clear();
    this.setState({
      name: '',
      email: '',
      picture:'',
      userId: '',
    });
    console.log("Async storage cleared");
    return this.props.navigation.navigate('EditProfile');
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <View style={styles.userInfo}>
            <FacebookAvatar url={this.state.picture} size={256} />
            <Text>{this.state.name}</Text>
            <View style={styles.userAttribute}>
              <Subheading>Email: </Subheading>
              <Text>{this.state.email}</Text>
              <Subheading>UserId: </Subheading>
              <Text>{this.state.userId}</Text>
            </View>
            <Button style={styles.button} contained={true} onPress={this._logout}>Edit</Button>
            <Button style={styles.button} contained={true} onPress={this._logout}>Logout</Button>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userInfo: {
    paddingTop: 35,
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.salmon,
  },
  userAttribute: {
    flex: 1,
  },
  activityIndicator: {
    marginTop: 200,
  },
  button: {
    backgroundColor: '#fff',
    marginBottom: 25
  }
  // image: {
  //   height: 100,
  //   width: 100,
  // }
});
