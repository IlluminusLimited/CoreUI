import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {Text} from "react-native-paper";
import TabBarIcon from "./Home";

export default class Collections extends React.Component {
  static navigationOptions = {
    tabBarIcon: <TabBarIcon name={'md-collections'}/>
  };

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
