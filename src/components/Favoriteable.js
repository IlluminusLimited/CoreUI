import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, IconButton} from 'react-native-paper';
import PropTypes from 'prop-types'
import {Icon} from "react-native-vector-icons/FontAwesome";
import CurrentUserProvider from "../utilities/CurrentUserProvider";
import {withNavigation} from "react-navigation";

//A Collectable component can be initialized with either an ID or all of the relevant information
class Favoriteable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      iconButton: this.props.iconButton,
      collectable: this.props.collectable,
      collectable_collection: null,
      favoriteCollection: null,
      isUserAnon: true,
      apiClient: null,
      loaded: false,
      buttonLoading: true,
      favorite: "favorite-border",
      buttonMode: 'outlined',
      buttonColor: '#c81d25'
    };
  }

  componentWillUnmount() {
    if (this.state.iconButton) {
      return;
    }
    this.focusListener.remove();
  }

  componentDidMount() {
    if (this.state.iconButton) {
      return this._initialize();
    }

    const {navigation} = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      return this._initialize(true);
    });
  }

  _initialize = (forceRefresh = false) => {
    console.log("initializing favoriteable");
    return this.setState({
        buttonLoading: true
      }, () => {
        // if (forceRefresh) {
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
              this.setState({
                currentUser: currentUser,
                loaded: true,
                isUserAnon: true,
                buttonLoading: false
              })
            });
        // }



      }
    );
  };

  _fetchCollectable = async () => {
    return this.state.apiClient.get(`${this.state.collectable.url}?with_collectable_collections=true`)
      .then(collectable => {
        const matchingCollection = collectable.collectable_collections.find(item => {
          return item.collection_id === this.state.favoriteCollection.id;
        });
        if (matchingCollection && Object.keys(matchingCollection).length > 0) {
          return this.setState({
            collectable: collectable,
            collectable_collection: matchingCollection,
            favorite: 'favorite',
            buttonMode: 'contained',
            loaded: true,
            buttonLoading: false,
          });
        }
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

  _authNavigate = () => {
    this.props.navigation.navigate('Auth')
  };

  _renderLogInIcon = () => (
    <IconButton
      icon={({size, color}) => (
        <MaterialCommunityIcons
          name={'logout'}
          size={size}
          color={color} />
      )}
      onPress={this.authNavigate}
    />
  );


  _renderLogInFullSize = () => (
    <View style={this.props.style}>
      <Button
        style={this.props.innerButtonStyle}
        mode={this.state.buttonMode}
        onPress={this.authNavigate}
        color={this.state.buttonColor}>
        Log in to favorite!
      </Button>
    </View>
  );

  _renderLoadingIcon = () => (
    <Button
      style={this.props.innerButtonStyle}
      onPress={this._toggleFavorite}
      icon={this.state.favorite}
      color={this.state.buttonColor} />
  );

  _renderLoadingFullSize = () => (
    <View style={this.props.style}>
      <Button
        loading
        style={this.props.innerButtonStyle}
        mode={this.state.buttonMode}
        onPress={this._toggleFavorite}
        icon={this.state.favorite}
        color={this.state.buttonColor}>
        Favorite
      </Button>
    </View>
  );

  _renderFavoriteIcon = () => {
    if (this.state.buttonLoading || !this.state.loaded) {
      return (
        <IconButton
          style={this.props.innerButtonStyle}
          color={this.state.buttonColor}
          onPress={() => {
            console.log("Loading button pressed")
          }}
          icon={({size, color}) => (
            <ActivityIndicator
              color={this.state.buttonColor}
            />
          )}
        />
      )
    }
    return (
      <IconButton
        animated={true}
        icon={this.state.favorite}
        style={this.props.innerButtonStyle}
        color={this.state.buttonColor}
        onPress={this._toggleFavorite}
      />
    );
  };

  _renderFavoriteFullSize = () => (
    <View style={this.props.style}>
      <Button
        loading={this.state.buttonLoading}
        style={this.props.innerButtonStyle}
        mode={this.state.buttonMode}
        onPress={this._toggleFavorite}
        icon={this.state.favorite}
        color={this.state.buttonColor}>
        Favorite
      </Button>
    </View>
  );

  _renderLoadingSpinner = () => (
    <View style={this.props.style}>
      <Button
        loading={true}
        style={this.props.innerButtonStyle}
        mode={this.state.buttonMode}
        onPress={() => {
          console.log("Loading button pressed")
        }}
        icon={this.state.favorite}
        color={this.state.buttonColor}>
        Loading
      </Button>
    </View>
  );


  //TODO: Make things that render this component pass in the collectableData
  //containing the collectable_collections. This will mean we don't have to make
  //another call to load the user and an API call.
  render() {
    if (this.state.loaded) {
      if (this.state.isUserAnon) {
        if (this.state.iconButton) {
          //RENDEDR Log in icon button
          return this._renderLogInIcon()
        }
        //RENDER log in full size button
        return this._renderLogInFullSize()
      }

      if (this.state.iconButton) {
        //RENDER Favorite icon button
        return this._renderFavoriteIcon()
      }
      //RENDER full size button
      return this._renderFavoriteFullSize()
    }

    if (this.state.iconButton) {
      return this._renderFavoriteIcon()
    }
    //RENDER loading spinner
    return this._renderLoadingSpinner()
  }
}

Favoriteable.propTypes = {
  style: PropTypes.object,
  innerButtonStyle: PropTypes.object,
  iconButton: PropTypes.bool,
  collectable: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,

};

const styles = StyleSheet.create({});

export default withNavigation(Favoriteable);
