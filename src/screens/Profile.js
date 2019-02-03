import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Collectables} from "../components/Collectables";
import TabBarIcon from "../components/TabBarIcon";
import {Subheading} from "react-native-paper";
import {Auth} from "aws-amplify";

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
    this._loadUser();
  }


  _loadUser = async () => {
    Auth.currentAuthenticatedUser()
      .then(currentUser => {
        console.log("CurrentUser:", currentUser);
        this.setState({currentUser: currentUser})
      })
      .catch(async error => {
        await Auth.currentSession()
          .then(session => console.log("No user, but there is a session:", session))
          .catch(error => console.log("No session either!", error));
        console.log("No authenticated user: ", error);
        this.props.navigation.navigate('Auth');
      });
  };

  render() {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  userInfo: {
    marginTop: 35,
    flex: 1,
    backgroundColor: 'blue'
  },
  userAttribute: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
