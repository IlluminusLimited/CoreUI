import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import PropTypes from 'prop-types'
import {Icon} from "react-native-vector-icons/FontAwesome";
import CurrentUserProvider from "../utilities/CurrentUserProvider";
import {withNavigation} from "react-navigation";

//A Collectable component can be initialized with either an ID or all of the relevant information
class Favoriteable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collectable: this.props.collectable,
      collectable_collection: null,
      favoriteCollection: null,
      currentUser: null,
      isUserAnon: true,
      apiClient: null,
      loaded: false,
      buttonLoading: true,
      favorite: "favorite-border",
      buttonMode: 'outlined',
    };
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.setState({
        buttonLoading: true
      }, () => {
        return CurrentUserProvider.loadUser()
          .then(currentUser => {
            if (currentUser.isLoggedIn()) {
              return Promise.all([
                currentUser.getFavoriteCollection(),
                CurrentUserProvider.getApiClient()
              ]).then((values) => {
                return this.setState({
                  favoriteCollection: values[0],
                  currentUser: currentUser,
                  apiClient: values[1],
                  isUserAnon: false,
                  buttonLoading: true,
                }, () => {
                  return this._fetchCollectable();
                })
              });
            }
            console.log("asdfds")
            this.setState({
              currentUser: currentUser,
              loaded: true,
              isUserAnon: true,
              buttonLoading: false
            })
          });
      });
    });
  }

  _fetchCollectable = async () => {
    return this.state.apiClient.get(`${this.state.collectable.url}?with_collectable_collections=true`)
      .then(collectable => {
        const matchingCollection = collectable.collectable_collections.find(item => {
          return item.collection_id === this.state.favoriteCollection.id;
        });
        if (matchingCollection && Object.keys(matchingCollection).length > 0) {
          console.log("A:LSDKFSAD:LKFJASF:LKASJF:LASKJFAS:LKFJAS:LFKJASF:LKJASF:LKSAJF:ASLKFJSA:LDKJSDL:KASJD")
          return this.setState({
            collectable: collectable,
            collectable_collection: matchingCollection,
            favorite: 'favorite',
            buttonMode: 'contained',
            loaded: true,
            buttonLoading: false,
          });
        }
        console.log("THIS IS HOW JAVASCRIPT DEVELOPERS WORK. THEY ARE DUMB")
        return this.setState({
          collectable: collectable,
          favorite: 'favorite-border',
          buttonMode: 'outlined',
          loaded: true,
          buttonLoading: false,
        });
      })
      .catch(error => console.error('error getting collectable', error));
  };

  _addToCollection = async () => {
    const url = await this.state.currentUser.getFavoriteCollection()
      .then(collection => collection.collectable_collections_url);
    this.state.apiClient.post(url, {
      data: {
        collectable_type: "Pin",
        collectable_id: this.state.collectable.id,
      }
    })
      .catch(errorOrResponse => {
        if (errorOrResponse && (errorOrResponse.ok === false)) {
          console.debug("Intercepted non-ok response. Attempting to parse response");
          return errorOrResponse.json()
            .then(json => {
              if (json.collection_id && json.collection_id.includes('has already been taken')) {
                console.debug("This collectable has already been added to this collection. Returning.")
                return json;
              }
              throw errorOrResponse;
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
      //TODO: alert user to problem? Snackbar?
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
    return this.state.apiClient.delete(this.state.collectable_collection.url)
      .then(() => {
        return this.setState({
          loaded: true,
          buttonLoading: false,
          buttonMode: 'outlined',
          favorite: 'favorite-border'
        })

      }).catch(error => {
        //TODO: alert user to problem?
        console.warn("Error while trying to delete from collection", error);
        return this.setState({
          loaded: true,
          buttonLoading: false,
          buttonMode: 'contained',
          favorite: 'favorite'
        })
      })
  };

  _toggleFavorite = () => {
    console.log("pressed");
    return this.setState(prevState => {
      return {
        buttonMode: prevState.buttonMode === 'outlined' ? 'contained' : 'outlined',
        favorite: prevState.favorite === 'favorite-border' ? 'favorite' : 'favorite-border',
        buttonLoading: true,
      }
    }, () => {
      //This comparison has to be "opposite" because we *just* changed the state.
      if (this.state.buttonMode === 'outlined') {
        return this._removeFromCollection();
      }
      return this._addToCollection();
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

export default withNavigation(Favoriteable);
