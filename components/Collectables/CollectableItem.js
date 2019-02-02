import React, {Component} from 'react';
import {StyleSheet, View, Image, TouchableWithoutFeedback, ScrollView} from 'react-native';
import {Card, Surface, Text} from 'react-native-paper';
import PropTypes from "prop-types";
import {withNavigation} from "react-navigation";

class CollectableItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collectable: this.props.collectableData
    };
  }

  _onPress = async () => {
    console.log("Pressed for id:", this.state.collectable.id);
    this.props.navigation.navigate('Collectable', {collectableId: this.state.collectable.id})
      // .catch(error => console.error("There was an error navigating", error))
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this._onPress}>

        <View style={styles.container}>
          {console.log("NAVIGATION 2222:", this.props.navigation)}

          {console.log(`Rendering key ${this.state.collectable.name}`)}
          {/*Implement check for thumbnailable before asking for specific image size*/}
          <Image style={styles.image}
                 source={{uri: this.state.collectable.images[0].storage_location_uri + '_200x200'}} />
          <Text>{this.state.collectable.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

CollectableItem.propTypes = {
  collectableData: PropTypes.object.isRequired,
};


const styles = StyleSheet.create({
  container: {
    width: 100,

    marginBottom: 10,
  },
  image: {
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});

export default withNavigation(CollectableItem);
