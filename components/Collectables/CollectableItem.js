import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Text} from 'react-native-paper';

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
        <Image style={styles.image} source={{uri: this.state.data.images[0].storage_location_uri + '_200x200'}} />
        <Text>{this.state.data.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    backgroundColor: 'green'
  },
  image: {
    aspectRatio: 1,
    resizeMode: 'contain',
    backgroundColor: 'black'

  }
});

export default CollectableItem;
