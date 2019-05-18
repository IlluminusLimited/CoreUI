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
import Colors from "../../constants/Colors";

//A Collection component can be initialized with either an ID or all of the relevant information
class Collection extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('collectionData', {name: "Favorites"}).name,
      headerStyle: {
        backgroundColor: Colors.salmon,
        shadowOpacity: 0,
        shadowOffset: {
          height: 0
        },
        shadowRadius: 0,
        borderBottomWidth: 0,
        elevation: 0
      },
      headerTitleStyle: {
        color: '#fff'
      }
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
        this.setState({
          currentUser: currentUser
        })
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
      this.setState({
        loading: true
      }, () => {
        return this._fetchCollection();
      });
    }
  };

  _fetchCollection = async () => {
    console.log("Fetch collection called");
    return this.state.currentUser.getFavoriteCollection()
      .then(collection => {
        console.log("Collection returned");
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
          <CollectableList
            sectionHeaderStyle={styles.sectionHeader}
            style={styles.container}
            currentUser={this.state.currentUser}
            pageLink={this.state.pageLink}
            alwaysReload={true}
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
  },
  sectionHeader: {
    height: 35,
    backgroundColor: Colors.salmon,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }

});

export default Collection;
