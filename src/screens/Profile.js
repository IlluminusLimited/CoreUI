import React, {Component} from 'react';
import {Linking, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Divider, Paragraph, Subheading, Surface, Title} from "react-native-paper";
import Colors from "../constants/Colors";
import CurrentUserProvider from "../utilities/CurrentUserProvider";
import CurrentUser from "../utilities/CurrentUser";
import SmartAvatar from "../components/SmartAvatar";
import HyperLink from "../components/HyperLink";
import ENV from "../utilities/Environment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoadingSpinner from "../components/LoadingSpinner";

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
      logout: false
    };
  }


  componentWillUnmount() {
    this.focusListener.remove();
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      if(this.state.logout) {
        return this.props.navigation.navigate('Auth');
      }
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
    const logoutUrl = `${ENV.AUTH0_SITE}/v2/logout?returnTo=http%3A%2F%2Fpinster.io`;
    console.log("Logout url", logoutUrl);
    this.setState({
      logout: true
    });
    Linking.openURL(logoutUrl);
  };

  _edit = async () => {
    this.setState({
      name: '',
      email: '',
      picture: '',
      userId: '',
    });
    return this.props.navigation.navigate('EditProfile', {
      name: this.state.name,
      bio: this.state.bio,
      picture: this.state.picture,
      apiClient: this.state.apiClient
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loading ? (
          <LoadingSpinner color={Colors.purple} />
        ) : (
          <ScrollView style={styles.container}>
            <View style={styles.userContainer}>
              <View style={styles.userAvatarContainer}>
                <SmartAvatar url={this.state.picture} userName={this.state.name} />
                <Title style={styles.userAvatarUserName}>{this.state.name}</Title>
              </View>
              <Divider />
              <Surface style={styles.userInfoAndButtonsContainer}>
                <Title>User Info</Title>
                <View style={styles.userInfoContainer}>
                  <Paragraph><Paragraph
                    style={styles.userInfoAttribute}>Email: </Paragraph>{this.state.email ? this.state.email : `No email address found.`}
                  </Paragraph>
                </View>
                <View style={styles.userInfoContainer}>
                  <Paragraph><Paragraph
                    style={styles.userInfoAttribute}>Bio: </Paragraph>{this.state.bio ? this.state.bio : `You haven't written a bio yet. You can use your bio to describe yourself for other traders to get to know you!`}
                  </Paragraph>
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    style={styles.button}
                    icon={({size, color}) => (
                      <MaterialCommunityIcons
                        name={'logout'}
                        size={size}
                        color={color} />
                    )}
                    color={Colors.turquoise}
                    mode={'contained'}
                    onPress={this._logout}>Logout</Button>
                  <Button style={styles.button} icon={'edit'} color={Colors.turquoise} mode={'contained'}
                          onPress={this._edit}>Edit</Button>
                </View>
              </Surface>
            </View>
            <Surface style={styles.settingsContainer}>
              <View style={styles.settingsContent}>
                <Subheading style={styles.pinUploadTitle}>Want to know more about Pinster?</Subheading>
                <HyperLink
                  url={'http://pinster.io'}
                  title={'Visit our website!'}
                  style={styles.hyperLinkButton} />
                <Divider />
                <Subheading style={styles.pinUploadTitle}>Don't see a pin that you're looking for?</Subheading>
                <HyperLink
                  url={'https://drive.google.com/drive/folders/1sDpbc2ifI1a_5PvvRXSHG723pzyw22cy?usp=sharing'}
                  title={'Submit a pin'}
                  style={styles.hyperLinkButton} />
                <Subheading style={styles.subheading}>Submission guidelines</Subheading>
                <Paragraph>{'\u2022 '}Images must be of DI pins, not pin art or any other content.</Paragraph>
                <Paragraph>{'\u2022 '}Images should be clear, well-lit, and include only the pin on a solid
                  background.</Paragraph>
                <Paragraph>{'\u2022 '}Submit each pin individually. Set photos are accepted, but not preferred, and may
                  take longer to upload.</Paragraph>
                <Paragraph>{'\u2022 '}Please provide a title for each pin and the Region/State/Affiliate it belongs
                  to.</Paragraph>
                <Paragraph>{'\u2022 '}Please make sure your pin does not already exist on the database before
                  submitting.</Paragraph>
              </View>
              <Divider />
              <Paragraph style={styles.appVersion}>App version: {Expo.Constants.manifest.version}</Paragraph>

            </Surface>
          </ScrollView>
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
    flex: 3,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor: 'blue'
  },
  userAvatarUserName: {
    flex: 1,
    margin: 10,
  },
  userInfoAndButtonsContainer: {
    flex: 11,
    elevation: 4,
    borderRadius: 25,
    padding: 20,
    margin: 10,
    // backgroundColor: 'yellow',
  },
  userInfoContainer: {
    flex: 4,
    flexWrap: 'wrap',
    // flexDirection: 'row',
    alignItems: 'flex-start',
    // backgroundColor: 'orange'
  },
  userInfoBioContainer: {
    flex: 4,
    padding: 1,
    flexWrap: 'wrap',
    // flexDirection: 'row',
    alignItems: 'flex-start',
    // backgroundColor: 'orange'
  },
  userInfoAttribute: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 4,
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'purple',
  },
  button: {
    marginTop: 20,
    // marginHorizontal: 5,
    width: 120
    // width: '50%'
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
    flex: 1,
    marginBottom: 10
    // alignItems: 'center',
    // backgroundColor: 'blue'
  },
  toggleButtonGroup: {
    flex: 1,
    flexDirection: 'row'
  },
  toggleButton: {
    backgroundColor: Colors.turquoise
  },
  hyperLinkButton: {
    marginVertical: 20,
  },
  pinUploadTitle: {
    fontWeight: 'bold'
  },
  subheading: {
    fontWeight: 'bold'
  },
  appVersion: {
    marginTop: 10
  }

});
