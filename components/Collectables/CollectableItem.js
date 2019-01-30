import React, {Component} from 'react';
import {StyleSheet, View, Image, TouchableWithoutFeedback} from 'react-native';
import {Text} from 'react-native-paper';

class CollectableItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.collectableData
    };
  }

  _onPress() {
    return console.log("Pressed")
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this._onPress}>
        <View style={styles.container} >
          {console.log(`Rendering key ${this.state.data.name}`)}
          <Image style={styles.image}
                 source={{uri: this.state.data.images[0].storage_location_uri + '_100x100'}} />
          <Text>{this.state.data.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    backgroundColor: 'green',
    marginBottom: 10,
  },
  image: {
    aspectRatio: 1,
    resizeMode: 'contain',
    backgroundColor: 'black'

  }
});

export default CollectableItem;
