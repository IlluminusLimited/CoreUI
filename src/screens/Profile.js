import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  Headline,
  Subheading,
  Text,
  Title,
  ToggleButton
} from "react-native-paper";
import Colors from "../constants/Colors";
import CurrentUserProvider from "../utilities/CurrentUserProvider";
import CurrentUser from "../utilities/CurrentUser";
import FacebookAvatar from "../components/FacebookAvatar";

export default class Profile extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: 'My Profile',
      headerStyle: {
        backgroundColor: Colors.purple
      },
      headerTitleStyle: {
        color: '#fff'
      }

    };
  };

  state = {
    loading: true,
    userId: this.props.userId,
    collections: [],
    picture: '',
    name: '',
    email: '',
    imageQualitySetting: 'low',

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


  _toggleQuality = (value) => {
    console.log("value", value);
    this.setState(prevState => {
      return {
        imageQualitySetting: value === null ?  prevState.imageQualitySetting : value
      }
    })
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
              <Text style={styles.userAttribute}>Email: </Text>
              <Text>{this.state.email}</Text>
            </View>
            <Divider />
            <View style={styles.settingsContainer}>
              <Headline>App Settings</Headline>
              <View style={styles.toggleButtonGroup}>
                <ToggleButton.Group
                  onValueChange={value => this._toggleQuality(value)}
                  value={this.state.imageQualitySetting}>
                  <ToggleButton
                    style={this.state.imageQualitySetting === 'low' ? {backgroundColor: Colors.turquoise} : {}}
                    icon={'photo-size-select-large'}
                    value={"low"}/>
                  <ToggleButton
                    style={this.state.imageQualitySetting === 'high' ? {backgroundColor: Colors.turquoise} : {}}
                    icon={'photo-size-select-actual'}
                    value={"high"}/>
                </ToggleButton.Group>
              </View>
            </View>

            <View style={styles.buttonContainer}>

              <Button style={styles.button} icon={'edit'} color={Colors.turquoise} mode={'contained'}
                      onPress={this._logout}>Edit</Button>
              <Button style={styles.button} icon={'exit-to-app'} color={Colors.turquoise} mode={'contained'}
                      onPress={this._logout}>Logout</Button>
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
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  picture: {
    flex: 1,
  },
  userInfo: {
    margin: 10,
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
  },
  userAttribute: {
    fontWeight: 'bold'
  },
  activityIndicator: {
    marginTop: 200,
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 25
  },
  button: {
    marginTop: 25,
    width: '70%'
  },
  settingsContainer: {
    flex: 1,
  },
  toggleButtonGroup: {
    flex: 1,
    flexDirection: 'row'
  },
  toggleButton: {
    backgroundColor: Colors.turquoise
  }

  // image: {
  //   height: 100,
  //   width: 100,
  // }
});
