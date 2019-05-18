import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Paragraph, Surface, Text} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import PropTypes from 'prop-types'
import Layout from "../../constants/Layout";
import ImageServiceImage from "../../components/ImageServiceImage";
import ENV from "../../utilities/Environment";
import Favoriteable from "../../components/Favoriteable";
import FeaturedImageList from "../../utilities/FeaturedImageList";
import CurrentUserProvider from "../../utilities/CurrentUserProvider";
import PropsHelper from "../../utilities/PropsHelper";

//A Collectable component can be initialized with either an ID or all of the relevant information
class Collectable extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('collectableName', ''),
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      apiClient: null,
      collectableId: PropsHelper.extract(this.props, 'collectableId'),
      collectable: PropsHelper.extract(this.props, 'collectable'),
      loaded: false,
      activeSlide: 0,
      favorite: 'unchecked',
    };
  }
//TODO: Add event listener to auto refresh when we view this page again

  //Check if user is logged in.
  //if collection was passed in, check for collectable_collections
    //if collectable_collections, check if collection_id ===
  componentDidMount() {
    if (this.props.collectable){
      this.props.navigation.setParams({collectableName: this.props.collectable.name});
    }
    CurrentUserProvider.getApiClient()
      .then(client => {
        return this.setState({
          apiClient: client,
          loaded: true
        })
      }).then(() => {
        if(this.state.collectable) {
          this.props.navigation.setParams({collectableName: this.state.collectable.name});
          return;
        }
      return this._fetchCollectable();
    })
  }

  _fetchCollectable = async () => {
    return this.state.apiClient.get(`${ENV.API_URI}/v1/pins/${this.state.collectableId}`)
      .then(collectable => {
        console.debug("We got back this thing", collectable);
        this.props.navigation.setParams({collectableName: collectable.name});
        if (collectable.images.length === 0) {
          console.debug("No images for collectable. Adding null image.");
          collectable.images.push(null)
        }
        this.setState({
          collectable: collectable,
          loaded: true
        });
      })
      .catch(error => {
        //TODO: Show error dialog
          console.error('Error getting collectable', error);
        }
      );
  };

  _renderItem({item, index}) {
    return (
      <ImageServiceImage style={styles.image}
                         imageData={item}
                         dimensions={'1000x1000'}
                         placeholder={require('../../../assets/images/PendingImage100x100.png')}
      />
    );
  }

  _authNavigate = () => {
    this.props.navigation.navigate('Auth')
  };

  // Carousel sliderWidth and itemWidth are important, if you change the stylesheet make sure this
  // still a valid setup.
  // TODO: Conditionally change the itemWidth property based on pagination. I think using the preview
  // function of the slider eliminates the need for a pagination element.
  render() {
    return (
      <React.Fragment>
        {
          this.state.loaded ? (
            this.state.collectable.length !== 0 ? (
              <View style={styles.container}>
                <View style={styles.carouselContainer}>
                  <Carousel
                    ref={(c) => {
                      this._carousel = c;
                    }}
                    data={FeaturedImageList.sortImages(this.state.collectable.images)}
                    renderItem={this._renderItem}
                    onSnapToItem={(index) => this.setState({activeSlide: index})}
                    sliderWidth={Layout.window.width}
                    itemWidth={Layout.window.width - 40}
                  />
                </View>
                <View style={styles.collectableDetails}>
                  <Favoriteable style={styles.favoriteable}
                                collectable={this.state.collectable}
                                authNavigate={this._authNavigate}
                                buttonColor={styles.favoriteableButton.color} />
                  <Surface style={styles.surface}>
                    <Text numberOfLines={1} style={styles.collectionDetail}><Text
                      style={styles.collectionDetailBold}>Name:</Text> {this.state.collectable.name}</Text>
                    <Paragraph numberOfLines={3} style={styles.collectionDetail}><Text
                      style={styles.collectionDetailBold}>Description:</Text> {this.state.collectable.description}
                    </Paragraph>
                  </Surface>
                </View>
              </View>
            ) : (
              <Text>There was an error retrieving this content</Text>
            )
          ) : (
            <ActivityIndicator style={styles.activityIndicator} />
          )
        }
      </React.Fragment>
    );
  }
}

Collectable.propTypes = {
  collectableId: PropTypes.string,
  collectableName: PropTypes.string,
  collectable: PropTypes.object
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'contain',
    overflow: 'hidden'
  },
  container: {
    flex: 1,
    backgroundColor: '#444444',
  },
  carouselContainer: {
    flex: 2,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselPagination: {},

  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteable: {
    flex: 2,
  },
  favoriteableButton: {
    color: '#c81d25'
  },
  collectionDetail: {
    fontSize: 18
  },
  collectionDetailBold: {
    fontWeight: "bold"
  },
  collectableDetails: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  surface: {
    flex: 3,
    backgroundColor: 'rgb(255,255,255)',
    height: '100%',
    width: '100%',
    borderRadius: 25,
    padding: 20,
    margin: 0,
    elevation: 4,
  },

});

export default Collectable;
