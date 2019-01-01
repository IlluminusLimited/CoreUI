import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Show from "../components/collectables/Show";

export default class CollectionsScreen extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <Show/>
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
  },
});
