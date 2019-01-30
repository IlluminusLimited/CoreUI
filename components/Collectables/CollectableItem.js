import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Appbar, Text, Card, Paragraph} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";

class CollectableItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 350,
        height: 350
      },
      data: this.props.collectableData
    };
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.collectableItem}>
          <Image source={{uri: this.state.data.images[0].storage_location_uri + '_100x100', height: 100, width: 100}} />
        </View>
        <Text>{this.state.data.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  collectableItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'black'
  }
});

export default CollectableItem;
