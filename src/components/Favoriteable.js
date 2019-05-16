import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, IconButton} from 'react-native-paper';
import PropTypes from 'prop-types'
import {Icon} from "react-native-vector-icons/FontAwesome";

//A Collectable component can be initialized with either an ID or all of the relevant information
class Favoriteable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      favorite: "favorite-border",
      buttonMode: 'outlined'
    };
  }

  _loadFavoritesCollection = async () => {

  }

  _addToCollection = async () => {
    //  if favoritesCollection doesn't exist then redirect
  }

  _removeFromCollection = async () => {

  }

  _toggleFavorite = () => {
    console.log("pressed");

    return this.setState(prevState => {
      return {
        buttonMode: prevState.buttonMode === 'outlined' ? 'contained' : 'outlined',
        favorite: prevState.favorite === 'favorite-border' ? 'favorite' : 'favorite-border',
      }
    });
  };

  // Carousel sliderWidth and itemWidth are important, if you change the stylesheet make sure this
  // still a valid setup.
  // TODO: Conditionally change the itemWidth property based on pagination. I think using the preview
  // function of the slider eliminates the need for a pagination element.
  render() {
    return (
      <View style={this.props.style}>
        {this.state.loading ? (
          <ActivityIndicator color={"#fff"} style={styles.activityIndicator} />
        ) : (
          <Button mode={this.state.buttonMode}
                  onPress={this._toggleFavorite}
                  icon={this.state.favorite}
                  color={'#c81d25'}>
            Favorite
          </Button>
          // <ToggleButton
          //   style={styles.favorite}
          //   color={"#fff"}
          //   icon={this.state.favorite === "checked" ? "favorite" : "favorite-border"}
          //   value={this.state.favorite === "checked" ? "favorite" : "favorite-border"}
          //   status={this.state.favorite}
          //   size={36}
          //   onPress={() => {
          //     this.setState(prevState => {
          //       return {
          //         favorite: prevState.favorite === 'checked' ? 'unchecked' : 'checked',
          //       }
          //     })
          //   }
          //   }
          // />
        )
        }
      </View>
    );
  }
}

Favoriteable.propTypes = {
  collectableId: PropTypes.string,
};

const styles = StyleSheet.create({
  favorite: {
    height: 48,
    width: 48,
    right: 0
  },
  activityIndicator: {
    height: 36,
    width: 36
  },

});

export default Favoriteable;
