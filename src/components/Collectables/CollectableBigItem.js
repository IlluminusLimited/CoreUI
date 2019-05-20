import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Surface, Title} from 'react-native-paper';
import PropTypes from "prop-types";
import {withNavigation} from "react-navigation";
import ImageServiceImage from "../ImageServiceImage";
import FeaturedImageList from "../../utilities/FeaturedImageList";
import Favoriteable from "../Favoriteable";
import {UserContext} from "../../contexts/UserContext"

class CollectableBigItem extends React.PureComponent {

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
          <View style={styles.placeholder} />
        ) : (
          <UserContext.Consumer>
            {userContext => (
              <Surface style={styles.surface}>
                {console.log(`Rendering collectableBigItem ${this.state.collectable.name}`)}
                <TouchableOpacity activeOpacity={0.7} onPress={this._onPress}>
                  <ImageServiceImage style={styles.image}
                                     imageData={FeaturedImageList.sortImages(this.state.collectable.images)[0]}
                                     dimensions={'1000x1000'} />
                </TouchableOpacity>
                <View style={styles.infoContainer}>
                  <Title
                    numberOfLines={2}
                    style={styles.infoTitle}
                  >{this.state.collectable.name}</Title>
                  <Favoriteable
                    currentUser={userContext.currentUser}
                    collectable={this.state.collectable}
                    iconButton={true}
                    style={styles.infoFavoriteButton}
                    innerButtonStyle={styles.innerButtonStyle}
                  />
                </View>
              </Surface>
            )}
          </UserContext.Consumer>
        )}
      </React.Fragment>
    );
  }
}

CollectableBigItem.propTypes = {
  collectable: PropTypes.object.isRequired,
};


const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    marginBottom: 20,
    padding: 8,
    backgroundColor: 'blue',
  },
  image: {
    aspectRatio: 1,
  },
  surface: {
    flex: 1,
    padding: 4,
    // height: 145,
    // width: '98%',
    marginHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'flex-end',
    elevation: 4,
    // backgroundColor: 'orange'
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoTitle: {
    flex: 5,
    backgroundColor: 'green'
  },
  infoFavoriteButton: {
    flex: 1,
    backgroundColor: 'blue'
  },
  innerButtonStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default withNavigation(CollectableBigItem);
