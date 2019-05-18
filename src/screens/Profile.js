import React, {Component} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  Headline, Paragraph,
  Subheading,
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
              <View style={styles.userInfoContainer}>
                <Divider />

                <View style={styles.userInfoSectionContainer}>
                  <Paragraph style={styles.userInfoAttribute}>Email: </Paragraph>
                  <Paragraph>{this.state.email ? this.state.email : `No email address found.`}</Paragraph>
                </View>
                <View style={styles.userInfoSectionContainer}>
                  <Paragraph style={styles.userInfoAttribute}>Bio: </Paragraph>
                  <Paragraph>{this.state.bio ? this.state.bio : `You haven't written a bio yet. You can use your bio to describe yourself for other traders to get to know you!`}</Paragraph>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <Button style={styles.button} icon={'edit'} color={Colors.turquoise} mode={'contained'}
                        onPress={this._logout}>Edit</Button>
                <Button style={styles.button} icon={'exit-to-app'} color={Colors.turquoise} mode={'contained'}
                        onPress={this._logout}>Logout</Button>
              </View>
            </View>
            <View style={styles.settingsContainer}>
              <Divider />
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
              <Divider />
            </View>
            <View style={styles.versionInfoContainer}>
              <Paragraph>App version: {Expo.Constants.manifest.version}</Paragraph>
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
    backgroundColor: 'orange'
  },
  userContainer: {
    flex: 2,
    backgroundColor: 'green'
  },
  userAvatarContainer: {
    flex: 2,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'blue'
  },
  userAvatarUserName: {
    margin: 10,
    backgroundColor: 'green'
  },
  userInfoContainer: {
    flex: 3,
    backgroundColor: 'yellow',
    justifyContent: 'space-around',
  },
  userInfoSectionContainer: {
    flex: 1,
    marginHorizontal: 10,
    paddingRight: 10,
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
    backgroundColor: 'purple',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    width: '60%'
  },
  settingsContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'pink',
    justifyContent: 'space-between',
  },
  settingsContent: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'blue'
  },
  toggleButtonGroup: {
    flex: 1,
    flexDirection: 'row'
  },
  toggleButton: {
    backgroundColor: Colors.turquoise
  },
  versionInfoContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: 'green',
    justifyContent: 'flex-end'
  }

  // image: {
  //   height: 100,
  //   width: 100,
  // }
});
