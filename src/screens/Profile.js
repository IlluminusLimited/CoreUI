import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Avatar, Button, Subheading, Text, Title} from "react-native-paper";
import Colors from "../constants/Colors";
import CurrentUserProvider from "../utilities/CurrentUserProvider";
import CurrentUser from "../utilities/CurrentUser";
import FacebookAvatar from "../components/FacebookAvatar";

export default class Profile extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: 'My Profile'
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
      console.debug("User:", currentUser);
      if (!currentUser.isLoggedIn()) {
        console.log("No logged in user. Redirecting to auth");
        return this.props.navigation.navigate('Auth');
      }
      this.setState({
        ...currentUser,
        loading: false
      });
    }).catch(error => {
      //TODO: Show dialog that lets them choose whether to reload or auth again
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
              <FacebookAvatar style={styles.picture} url={this.state.picture ? this.state.picture : ''} />
              <Title style={styles.userName}>{this.state.name}</Title>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.userAttribute}>
                <Subheading>Email: </Subheading>
                <Text>{this.state.email}</Text>
                <Subheading>UserId: </Subheading>
                <Text>{this.state.userId}</Text>
              </View>

            </View>
            <View style={styles.buttonContainer}>
              <Button style={styles.button} icon={'edit'} color={Colors.turquoise} mode={'contained'} onPress={this._logout}>Edit</Button>
              <Button style={styles.button} icon={'exit-to-app'} color={Colors.turquoise}  mode={'contained'} onPress={this._logout}>Logout</Button>
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
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  picture: {
    flex: 1,
  },
  userName: {
    flex: 8,
    margin: 10
  },
  userInfo: {
    flexDirection: 'row',
    flex: 8,
    backgroundColor: '#fff',
  },
  userAttribute: {
    flex: 1,
  },
  activityIndicator: {
    marginTop: 200,
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 25
  },
  button: {
    marginTop: 25,
    width: 150
  },
  buttonContent: {
    color: Colors.purple
  },
  // image: {
  //   height: 100,
  //   width: 100,
  // }
});
