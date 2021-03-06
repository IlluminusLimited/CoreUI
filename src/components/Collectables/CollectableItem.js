import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import PropTypes from "prop-types";
import {withNavigation} from "react-navigation";
import ImageServiceImage from "../ImageServiceImage";
import FeaturedImageList from "../../utilities/FeaturedImageList";

class CollectableItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collectable: this.props.collectable,
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  _onPress = () => {
    this.props.navigation.navigate('Collectable', {
      collectable: this.state.collectable
    })
  };

  //TODO: Card content gets hidden when pagination happens.
  render() {
    return (
      <React.Fragment>
        {this.state.collectable.isPadding ? (
          <View style={styles.container} />
        ) : (
          <TouchableOpacity activeOpacity={0.7} onPress={this._onPress}>
            <Surface style={styles.surface}>
              {console.log(`Rendering collectableItem ${this.state.collectable.name}`)}
              {/*Implement check for thumbnailable before asking for specific image size*/}
              <ImageServiceImage style={styles.image}
                                 imageData={FeaturedImageList.sortImages(this.state.collectable.images)[0]}
                                 dimensions={'200x200'} />
              <Text numberOfLines={2}>{this.state.collectable.name}</Text>
            </Surface>
          </TouchableOpacity>
        )}
      </React.Fragment>
    );
  }
}

CollectableItem.propTypes = {
  collectable: PropTypes.object.isRequired,
};


//Make sure to update what CollectableList _getItemLayout() to match widthxheight
const styles = StyleSheet.create({
  container: {
    width: 110,
    marginBottom: 10,
    padding: 4,
    // backgroundColor: 'blue',
  },
  image: {
    aspectRatio: 1,
  },
  surface: {
    padding: 4,
    height: 145,
    width: 110,
    marginBottom: 10,
    justifyContent: 'flex-end',
    elevation: 4,
    // backgroundColor: 'orange'
  },
});

export default withNavigation(CollectableItem);
