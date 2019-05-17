import React from 'react';
import {AsyncStorage, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {withNavigation} from "react-navigation";

import {Headline, Subheading, Text} from "react-native-paper";

class AboutUs extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: 'About Us',
    };
  };

  state = {
    loaded: false,
    userId: this.props.userId,
    collections: [],
    currentUser: {}
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
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
        </ScrollView>
      </SafeAreaView>
    )
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
      backgroundColor: 'purple',
      alignItems: 'center'
    }
  }
);

export default withNavigation(AboutUs);