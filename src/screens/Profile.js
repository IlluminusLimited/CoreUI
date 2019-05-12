import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Button, Subheading} from "react-native-paper";
import Colors from "../constants/Colors";
import FacebookAvatar from "../components/FacebookAvatar";
import CurrentUserProvider from "../utilities/CurrentUserProvider";
import CurrentUser from "../utilities/CurrentUser";

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

  _loadUser() {
    CurrentUserProvider.loadUser().then(currentUser => {
      console.log("User:", currentUser);
      if(!currentUser.isLoggedIn()){
        console.log("No logged in user. Redirecting to auth");
        return this.props.navigation.navigate('Auth');
      }
      this.setState({
        currentUser,
        loading: false
      });
    }).catch(error => {
        console.log("Error loading user. Redirecting to auth", error);
        return this.props.navigation.navigate('Auth');
    })
  };

  _logout = async () => {
    await CurrentUser.logOut();
    return this.props.navigation.navigate('Auth');
  };

  _edit = async () => {
    this.setState({
      name: '',
      email: '',
      picture: '',
      userId: '',
    });
    return this.props.navigation.navigate('EditProfile');
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <View style={styles.container}>
            <View style={styles.avatarContainer}>
            </View>
            <View style={styles.userInfo}>
              <Text>{this.state.name}</Text>
              <View style={styles.userAttribute}>
                <Subheading>Email: </Subheading>
                <Text>{this.state.email}</Text>
                <Subheading>UserId: </Subheading>
                <Text>{this.state.userId}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button style={styles.button} contained={true} onPress={this._logout}>Edit</Button>
                <Button style={styles.button} contained={true} onPress={this._logout}>Logout</Button>
              </View>
            </View>
            <View style={styles.picture}>
              <FacebookAvatar url={this.state.picture ? this.state.picture : require('../../assets/images/BrokenImage_200x200.png')} size={150} />
            </View>
          </View>
        )
        }
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    flex: 2,
    backgroundColor: Colors.salmon,
  },
  picture: {
    position: 'absolute',
    left: '5%',
    top: '30%',
  },
  userInfo: {
    flex: 3,
    backgroundColor: '#fff',
  },
  userAttribute: {
    flex: 1,
  },
  activityIndicator: {
    marginTop: 200,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 25
  },
  button: {
    backgroundColor: Colors.turquoise,
    marginTop: 15,
    width: 150
  }
  // image: {
  //   height: 100,
  //   width: 100,
  // }
});
