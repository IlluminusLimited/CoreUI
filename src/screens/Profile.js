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

  _loadUser() {
    this.setState({
      loading: true
    });
    //TODO: Extract currentUser stuff into CurrentUser
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
      picture: '',
      userId: '',
    });
    console.log("Async storage cleared");
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
              <FacebookAvatar url={this.state.picture} size={150} />
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
