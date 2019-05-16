import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import PropTypes from "prop-types";
import {withNavigation} from "react-navigation";
import ImageServiceImage from "../ImageServiceImage";
import FeaturedImageList from "../../utilities/FeaturedImageList";

class CollectableItem extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      collectable: this.props.collectable,
    };
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
                                 placeholder={require('../../../assets/images/PendingImage_200x200.png')}
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
