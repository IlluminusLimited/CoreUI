import React, {Component} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  Headline, Paragraph,
  Subheading, Surface,
  Text,
  Title,
  ToggleButton
} from "react-native-paper";
import Colors from "../constants/Colors";
import CurrentUserProvider from "../utilities/CurrentUserProvider";
import CurrentUser from "../utilities/CurrentUser";
import SmartAvatar from "../components/SmartAvatar";
import StorageAdapter from "../utilities/StorageAdapter";

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

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userId: this.props.userId,
      collections: [],
      picture: '',
      name: '',
      email: '',
      bio: '',
      imageQualitySetting: 'low',
    };
  }


  componentWillUnmount() {
    StorageAdapter.save(['imageQuality'], this.state.imageQualitySetting);
    this.focusListener.remove();
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      return this._loadUser();
    });
  }

  _loadUser = async () => {
    CurrentUserProvider.loadUser().then(currentUser => {
      console.debug("User:", currentUser);
      if (!currentUser.isLoggedIn()) {
        console.log("No logged in user. Redirecting to auth");
        return this.props.navigation.navigate('Auth');
      }
      this.setState({
        ...currentUser,
        apiClient: currentUser.getApiClient(),
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
    return this.props.navigation.navigate('EditProfile',{name: this.state.name,
      bio: this.state.bio,
      picture: this.state.picture,
      apiClient: this.state.apiClient});
  };


  _toggleQuality = (value) => {
    this.setState(prevState => {
      return {
        imageQualitySetting: value === null ? prevState.imageQualitySetting : value
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
            <View style={styles.userContainer}>
              <View style={styles.userAvatarContainer}>
                <SmartAvatar url={this.state.picture} userName={this.state.name} />
                <Title style={styles.userAvatarUserName}>{this.state.name}</Title>
              </View>
              <Divider/>
              <Surface style={styles.userInfoAndButtonsContainer}>
                <Title>User Info</Title>
                  <View style={styles.userInfoContainer}>
                    <Paragraph><Paragraph style={styles.userInfoAttribute}>Email: </Paragraph>{this.state.email ? this.state.email : `No email address found.`}</Paragraph>
                  </View>
                <View style={styles.userInfoContainer}>
                  <Paragraph><Paragraph style={styles.userInfoAttribute}>Bio: </Paragraph>{this.state.bio ? this.state.bio : `You haven't written a bio yet. You can use your bio to describe yourself for other traders to get to know you!`}</Paragraph>
                </View>
                  <View style={styles.buttonContainer}>
                  <Button style={styles.button} icon={'edit'} color={Colors.turquoise} mode={'contained'}
                          onPress={this._edit}>Edit</Button>
                  <Button style={styles.button} icon={'exit-to-app'} color={Colors.turquoise} mode={'contained'}
                          onPress={this._logout}>Logout</Button>
                </View>
              </Surface>
            </View>
            <Surface style={styles.settingsContainer}>
              <Headline>App Settings</Headline>
              <View style={styles.settingsContent}>

                <Subheading>Image Quality</Subheading>
                <View style={styles.toggleButtonGroup}>
                  <ToggleButton.Group
                    onValueChange={value => this._toggleQuality(value)}
                    value={this.state.imageQualitySetting}>
                    <ToggleButton
                      style={this.state.imageQualitySetting === 'low' ? {backgroundColor: Colors.turquoise} : {}}
                      icon={'photo-size-select-large'}
                      value={"low"} />
                    <ToggleButton
                      style={this.state.imageQualitySetting === 'high' ? {backgroundColor: Colors.turquoise} : {}}
                      icon={'photo-size-select-actual'}
                      value={"high"} />
                  </ToggleButton.Group>
                </View>
              </View>
              <Paragraph>App version: {Expo.Constants.manifest.version}</Paragraph>

            </Surface>
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
    // backgroundColor: 'orange'
  },
  userContainer: {
    flex: 4,
    // backgroundColor: 'green'
  },
  userAvatarContainer: {
    flex: 2,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor: 'blue'
  },
  userAvatarUserName: {
    margin: 10,
  },
  userInfoAndButtonsContainer: {
    flex: 10,
    elevation: 4,
    borderRadius: 25,
    padding: 20,
    margin: 10,
    // backgroundColor: 'yellow',
  },
  userInfoContainer: {
    flex: 3,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'orange'
  },
  userInfoBioContainer: {
    flex: 4,
    padding: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'orange'
  },
  userInfoAttribute: {
    fontWeight: 'bold',
  },
  activityIndicator: {
    marginTop: 200,
  },
  buttonContainer: {
    flex: 3,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // backgroundColor: 'purple',
  },
  button: {
    marginTop: 10,
    width: '50%'
  },
  settingsContainer: {
    flex: 2,
    elevation: 4,
    borderRadius: 25,
    padding: 20,
    margin: 10,
    justifyContent: 'space-between',
    // backgroundColor: 'pink',

  },
  settingsContent: {
    flex: 2,
    alignItems: 'center',
    // backgroundColor: 'blue'
  },
  toggleButtonGroup: {
    flex: 1,
    flexDirection: 'row'
  },
  toggleButton: {
    backgroundColor: Colors.turquoise
  },

});
