import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, ToggleButton} from 'react-native-paper';
import PropTypes from 'prop-types'

//A Collectable component can be initialized with either an ID or all of the relevant information
class Favoriteable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      favorite: 'unchecked',
    };
  }

  _loadFavoritesCollection = async () => {

  }

  _addToCollection = async () => {
    //  if favoritesCollection doesn't exist then redirect
  }

  _removeFromCollection = async () => {

  }

  // Carousel sliderWidth and itemWidth are important, if you change the stylesheet make sure this
  // still a valid setup.
  // TODO: Conditionally change the itemWidth property based on pagination. I think using the preview
  // function of the slider eliminates the need for a pagination element.
  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator color={"#fff"} style={styles.activityIndicator} />
        ) : (
          <ToggleButton
            style={styles.favorite}
            color={"#fff"}
            icon={this.state.favorite === "checked" ? "favorite" : "favorite-border"}
            value={this.state.favorite === "checked" ? "favorite" : "favorite-border"}
            status={this.state.favorite}
            size={36}
            onPress={() => {
              this.setState(prevState => {
                return {
                  favorite: prevState.favorite === 'checked' ? 'unchecked' : 'checked',
                }
              })
            }
            }
          />
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
