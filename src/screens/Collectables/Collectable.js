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
    const {navigation} = this.props;
    const collectableId = navigation.getParam('collectableId', null);
    const collectableName = navigation.getParam('collectableName', '');

    this.state = {
      apiClient: null,
      collectableId: (collectableId ? collectableId : this.props.collectableId),
      collectable: {name: collectableName},
      loaded: false,
      activeSlide: 0,
      favorite: 'unchecked',
    };
  }

  componentDidMount() {

    CurrentUserProvider.getApiClient()
      .then(client => {
        return this.setState({
          apiClient: client,
          loaded: true
        })
      }).then(() => {
      return this._fetchCollectable();
    })
  }

  _fetchCollectable() {
    this.state.apiClient.get(`${ENV.API_URI}/v1/pins/${this.state.collectableId}`)
      .then(collectable => {
        console.log("We got back this thing", collectable);
        this.props.navigation.setParams({collectableName: collectable.name});
        if (collectable.images.length === 0) {
          console.log("No images for collectable. Adding null image.");
          collectable.images.push(null)
        }
        this.setState({
          collectable: collectable,
          loaded: true
        });
      })
      .catch(error => console.error('error getting collectable', error));
  }

  _renderItem({item, index}) {
    return (
      <ImageServiceImage style={styles.image}
                         imageData={item}
                         dimensions={'1000x1000'}
                         placeholder={require('../../../assets/images/PendingImage_200x200.png')}
      />
    );
  }

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
                  <Favoriteable style={styles.favoriteable} collectableId={this.state.collectableId} />
                  <Surface style={styles.surface}>
                    <Text style={styles.collectionDetail}><Text
                      style={styles.collectionDetailBold}>Name:</Text> {this.state.collectable.name}</Text>
                    <Paragraph style={styles.collectionDetail}><Text
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
  collectableName: PropTypes.string
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
    flex: 1,
    marginBottom: 10
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
    backgroundColor: 'rgb(255,255,184)',
    height: '100%',
    width: '100%',
    borderRadius: 25,
    padding: 20,
    margin: 0,
    elevation: 4,
  },

});

export default Collectable;
