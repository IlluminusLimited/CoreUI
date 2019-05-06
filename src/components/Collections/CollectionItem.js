import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import PropTypes from "prop-types";
import {withNavigation} from "react-navigation";
import ImageServiceImage from "../ImageServiceImage";

class CollectionItem extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      collection: this.props.collectionData
    };
  }

  _onPress = async () => {
    console.log("Pressed for id:", this.state.collection.id);
    this.props.navigation.navigate('Collection', {collectionId: this.state.collection.id})
    // .catch(error => console.error("There was an error navigating", error))
  };

  //TODO: Implement check for thumbnailable before asking for specific image size
  //TODO: image name and description are hidden in the api, need to populate those fields before this will work.
  //TODO: Card content gets hidden when pagination happens.
  render() {
    return (
      <TouchableWithoutFeedback onPress={this._onPress}>
        <Surface style={styles.surface}>
          {console.log(`Rendering collectionItem ${this.state.collection.name}`)}
          {/*Implement check for thumbnailable before asking for specific image size*/}
          <ImageServiceImage style={styles.image}
                             imageData={this.state.collection.images[0]}
                             dimensions={'200x200'} />
          <Text numberOfLines={2}>{this.state.collection.name}</Text>
        </Surface>
      </TouchableWithoutFeedback>
    );
  }
}

CollectionItem.propTypes = {
  collectionData: PropTypes.object.isRequired,
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

export default withNavigation(CollectionItem);
