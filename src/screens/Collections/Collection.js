import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Paragraph, Searchbar, Surface, Text} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import PropTypes from 'prop-types'
import Layout from "../../constants/Layout";
import ImageServiceImage from "../../components/ImageServiceImage";
import CollectableList from "../../components/Collectables/CollectableList";
import CurrentUserProvider from "../../utilities/CurrentUserProvider";
import ApiClient from "../../utilities/ApiClient";

//A Collection component can be initialized with either an ID or all of the relevant information
class Collection extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('collectionData', {name: "Favorites"}).name,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const collectionData = navigation.getParam('collectionData', this.props.collectionData ? this.props.collectionData : {});
    const collectionUrl = navigation.getParam('collectionUrl', this.props.collectionUrl ? this.props.collectionUrl : collectionData.url);
    this.state = {
      collection: collectionData,
      collectionUrl: collectionUrl,
      loading: true,
      pageLink: collectionData.collectable_collections_url
    };
  }

  componentDidMount() {
    CurrentUserProvider.loadUser().then(currentUser => {
      if (currentUser.isLoggedIn()) {
        return this._loadCollection();
      }
      this.props.navigation.navigate('Auth')
    })

  }

  _loadCollection = async () => {
    if (this.state.pageLink) {
      return this.setState({
        loading: false
      });
    }
    else {
      console.log("No collection data was passed in. Fetching.");
      await this.setState({
        loading: true
      });
      return await this._fetchCollection();
    }
  };

  _fetchCollection = async () => {
    const currentUser = await CurrentUserProvider.loadUser();
    return currentUser.getFavoriteCollection()
      .then(collection => {
        //TODO: Recover from 404 with a retryHandler.
        this.props.navigation.setParams({collectionName: collection.name});
        return this.setState({
          collection: collection,
          pageLink: collection.collectable_collections_url,
          loading: false
        });
      })
      .catch(error => console.error('Error getting collection', error));
  };

  _renderItem({item, index}) {
    return (
      <ImageServiceImage style={styles.image}
                         imageData={item}
                         dimensions={'1000x1000'}
                         placeholder={require('../../../assets/images/Collections_Default_200x200.png')} />
    );
  }


// Carousel sliderWidth and itemWidth are important, if you change the stylesheet make sure this
// still a valid setup.
// TODO: Conditionally change the itemWidth property based on pagination. I think using the preview
// function of the slider eliminates the need for a pagination element.
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <CollectableList pageLink={this.state.pageLink}
                           noResultsText={"You haven't added anything to this collection yet! When looking at a Pin you can use the Favorite button to add it to this collection!"} />
        )}
      </SafeAreaView>
    );
  }
}

Collection.propTypes = {
  collectionData: PropTypes.object,
  apiClient: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }

});

export default Collection;
