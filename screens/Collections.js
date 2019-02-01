import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Text} from "react-native-paper";
import {Ionicons} from "react-native-vector-icons";

export default class Collections extends React.Component {
  // static navigationOptions = {
  //   tabBarIcon: <Ionicons name={'md-home'} size={24}/>
  // };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Collections go here</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100 + '%',
    width: 100 + '%',
    backgroundColor: '#fff',
    marginTop: 25
  }
});
