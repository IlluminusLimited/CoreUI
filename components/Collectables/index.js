import React, {Component} from 'react';
import {StyleSheet, View, Image, ScrollView} from 'react-native';
import {Appbar, Text, Card, Title, Paragraph} from 'react-native-paper';
import CollectableItem from "./CollectableItem";

class Collectables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectables: this.props.collectableData
    }
  };



  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {Object.keys(this.state.collectables).map(key => (
          <CollectableItem
            key={key}
            uid={key}
            collectableData={this.state.collectables[key]}
          />
        ))}

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'blue',
    justifyContent: 'space-around'
  },
  collectableItem: {
    backgroundColor: 'yellow',
    width: 100,
  },
  image: {
    aspectRatio: 1,
    backgroundColor: 'black',
    resizeMode: 'contain'
  }
});

export default Collectables;
