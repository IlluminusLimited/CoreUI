import React, {Component} from 'react';
import {StyleSheet, View, Image, TouchableWithoutFeedback, ScrollView} from 'react-native';
import {Card, Surface, Text, TouchableRipple} from 'react-native-paper';
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
        <Surface style={styles.surface}>
            {console.log(`Rendering key ${this.state.collectable.name}`)}
            {/*Implement check for thumbnailable before asking for specific image size*/}
            <Image style={styles.image}
                   source={{uri: this.state.collectable.images[0].storage_location_uri + '_200x200'}} />
            <Text>{this.state.collectable.name}</Text>
        </Surface>
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
  surface: {
    padding: 4,
    height: 145,
    width: 110,
    marginBottom: 10,
    justifyContent: 'flex-end',
    elevation: 4,
  },
});

export default withNavigation(CollectableItem);
