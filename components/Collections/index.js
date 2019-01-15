import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Collectables from '../Collectables';

export default class Collections extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <Collectables />
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
