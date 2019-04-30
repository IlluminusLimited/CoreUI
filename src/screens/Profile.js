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
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      return this.props.navigation.navigate('Auth');
    }
    console.log("CurrentToken:", userToken);
    this.setState({currentUser: userToken});
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Avatar.Image source={require('../../assets/images/icons/Icon.png')} size={64} />
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
