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
      buttonMode: 'outlined',
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

  //TODO: Make things that render this component pass in the collectableData
  //containing the collectable_collections. This will mean we don't have to make
  //another call to load the user and an API call.
  render() {
    return (
      <React.Fragment>
        {this.state.isUserAnon ?
          this.state.loaded ? (
            <View style={this.props.style}>
              <Button mode={this.state.buttonMode}
                      onPress={this.props.authNavigate}
                      color={this.props.buttonColor}>
                Log in to favorite!
              </Button>
            </View>
          ) : (
            <ActivityIndicator style={this.props.style} />
          )
          : (
            <View style={this.props.style}>
              <Button mode={this.state.buttonMode}
                      onPress={this._toggleFavorite}
                      icon={this.state.favorite}
                      color={this.props.buttonColor}>
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
  authNavigate: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired
};

const styles = StyleSheet.create({});

export default Favoriteable;
