import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {Text} from "react-native-paper";

export default class Collections extends React.Component {
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
