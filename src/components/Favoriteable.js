import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import PropTypes from 'prop-types'
import {Icon} from "react-native-vector-icons/FontAwesome";
import CurrentUserProvider from "../utilities/CurrentUserProvider";
import ENV from "../utilities/Environment";
import PropsHelper from "../utilities/PropsHelper";

//A Collectable component can be initialized with either an ID or all of the relevant information
class Favoriteable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collectable: this.props.collectable,
      collectable_collection: null,
      currentUser: null,
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
              currentUser: currentUser,
              apiClient: client,
              loaded: true,
              isUserAnon: false
            })
          }).then(() => {
            return this._fetchCollectable();
          })
      }
      this.setState({
        currentUser: currentUser,
        loaded: true,
        isUserAnon: true
      })
    });
  }

  _fetchCollectable() {
    this.state.apiClient.get(`${this.state.collectable.url}?with_collectable_collections=true`)
      .then(collectable => {
        this.setState({
          collectable: collectable,
          loaded: true
        });
      })
      .catch(error => console.error('error getting collectable', error));
  }

  _addToCollection = async () => {
    const url = await this.state.currentUser.getFavoriteCollection()
      .then(collection => collection.collectable_collections_url);
    this.state.apiClient.post(url, {
      data: {
        collectable_type: "Pin",
        collectable_id: this.props.collectableId,
      }
    })
      .catch(errorOrResponse => {
        if (errorOrResponse && (errorOrResponse.ok === false)) {
          console.debug("Intercepted non-ok response. Attempting to parse response");
          return errorOrResponse.json()
            .then(json => {
              if(json.collection_id && json.collection_id.includes('has already been taken')) {
                console.debug("This collectable has already been added to this collection. Returning.")
                return json;
              }
            })
        }
        console.warn("Got non response. Throwing");
        throw errorOrResponse;
      })
      .then((json) => {
        this.setState({
          collectable_collection: json,
          loaded: true,
          buttonLoading: false,
          buttonMode: 'contained',
          favorite: 'favorite'
        })
      }).catch(error => {
      //TODO: alert user to problem?
      console.warn("Error while trying to add to collection", error);
      this.setState({
        loaded: true,
        buttonLoading: false,
        buttonMode: 'outlined',
        favorite: 'favorite-border'
      })
    })
  };

  _removeFromCollection = async () => {
    this.state.apiClient.delete(this.collectable_collection.url)
      .then(() => {
        this.setState({
          loaded: true,
          buttonLoading: false,
          buttonMode: 'contained',
          favorite: 'favorite'
        })
      }).catch(error => {
      //TODO: alert user to problem?
      console.warn("Error while trying to add to collection", error);
      this.setState({
        loaded: true,
        buttonLoading: false,
        buttonMode: 'outlined',
        favorite: 'favorite-border'
      })
    })
  }

  _toggleFavorite = () => {
    console.log("pressed");
    return this.setState(prevState => {
      return {
        buttonMode: prevState.buttonMode === 'outlined' ? 'contained' : 'outlined',
        favorite: prevState.favorite === 'favorite-border' ? 'favorite' : 'favorite-border',
        buttonLoading: true,
      }
    }, this._addToCollection);
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
            <ActivityIndicator style={this.props.style} color={this.props.buttonColor} />
          )
          : (
            <View style={this.props.style}>
              {this.state.buttonLoading ? (
                <Button loading mode={this.state.buttonMode}
                        onPress={this._toggleFavorite}
                        icon={this.state.favorite}
                        color={this.props.buttonColor}>
                  Favorite
                </Button>
              ) : (
                <Button mode={this.state.buttonMode}
                        onPress={this._toggleFavorite}
                        icon={this.state.favorite}
                        color={this.props.buttonColor}>
                  Favorite
                </Button>
              )}
            </View>)
        }
      </React.Fragment>
    )
  }
}

Favoriteable.propTypes = {
  collectable: PropTypes.object.isRequired,
  authNavigate: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired
};

const styles = StyleSheet.create({});

export default Favoriteable;
