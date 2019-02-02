import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Collectables} from "../components/Collectables";
import TabBarIcon from "../components/TabBarIcon";

export default class Profile extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: "My Profile"
    };
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Profile</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingTop: 10
  },
});
