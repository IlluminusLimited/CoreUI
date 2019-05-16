import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, IconButton} from 'react-native-paper';
import PropTypes from 'prop-types'
import {Icon} from "react-native-vector-icons/FontAwesome";
import CurrentUserProvider from "../utilities/CurrentUserProvider";
import ENV from "../utilities/Environment";

//A Collectable component can be initialized with either an ID or all of the relevant information
class Favoriteable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isUserAnon: true,
      apiClient: null,
      loading: false,
      favorite: "favorite-border",
      buttonMode: 'outlined'
    };
  }

  componentDidMount() {
    return CurrentUserProvider.loadUser().then(currentUser => {
      if (currentUser.isLoggedIn()) {
        return CurrentUserProvider.getApiClient()
          .then(client => {
            return this.setState({
              apiClient: client,
              loaded: true,
              isUserAnon: false
            })
          }).then(() => {
            return this._fetchCollectable();
          })
      }
      this.setState({
        loaded: true,
        isUserAnon: true
      })
    });
  }

  _fetchCollectable() {
    this.state.apiClient.get(`${ENV.API_URI}/v1/pins/${this.props.collectableId}?with_collectable_collections=true`)
      .then(collectable => {
        this.setState({
          collectable: collectable,
          loaded: true
        });
      })
      .catch(error => console.error('error getting collectable', error));
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
        loading: true,
      }
    });
  };

  _redirectToLogin = () => {
    this.props.navigation.navigate('Auth')
  }

  // Carousel sliderWidth and itemWidth are important, if you change the stylesheet make sure this
  // still a valid setup.
  // TODO: Conditionally change the itemWidth property based on pagination. I think using the preview
  // function of the slider eliminates the need for a pagination element.
  render() {
    return (
      <React.Fragment>
        {this.state.isUserAnon ?
          this.state.loaded ? (
            <View style={this.props.style}>
              <Button mode={this.state.buttonMode}
                      onPress={this._redirectToLogin}
                      color={'#c81d25'}>
                Log in to favorite!
              </Button>
            </View>
          ) : (
            <ActivityIndicator style={styles.activityIndicator} />
          )
          : (
            <View style={this.props.style}>
              <Button mode={this.state.buttonMode}
                      onPress={this._toggleFavorite}
                      icon={this.state.favorite}
                      color={'#c81d25'}>
                Favorite
              </Button>
            </View>)
        }
      </React.Fragment>
    )
  }
}

Favoriteable.propTypes = {
  collectableId: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  favorite: {
    height: 48,
    width: 48,
    right: 0
  },
  activityIndicator: {
    flex: 1
  },

});

export default Favoriteable;
