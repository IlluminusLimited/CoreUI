import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Paragraph, Surface, Text} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import PropTypes from 'prop-types'
import Layout from "../../constants/Layout";
import ImageServiceImage from "../../components/ImageServiceImage";

//A Collection component can be initialized with either an ID or all of the relevant information
class Collection extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('collectionData', {}).name,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const collectionData = navigation.getParam('collectionData', {});
    const apiClient = navigation.getParam('apiClient', null);

    this.state = {
      apiClient: (apiClient ? apiClient : this.props.apiClient),
      // collectionId: (collectionId ? collectionId : this.props.collectionId),
      collection: (collectionData ? collectionData : this.props.collectionData),
      loaded: true,
      activeSlide: 0
    };
  }

  componentDidMount() {
    return this._loadCollection();
  }

  _loadCollection = async () => {
    if (!this.state.collection) {
      // console.log("No collection data was passed in. Fetching.");
      // await this.setState({
      //   loaded: false
      // });
      // return await this._fetchCollection();
      throw new Error("This isn't supported.")
    }
  };

  // _fetchCollection() {
  //   this.state.apiClient.get(`/v1/collections/${this.state.collectionId}`)
  //     .then(collection => {
  //       console.debug("Collection: ", collection);
  //       this.props.navigation.setParams({collectionName: collection.name});
  //       return this.setState({
  //         collection: collection,
  //         loaded: true
  //       });
  //     })
  //     .catch(error => console.error('Error getting collection', error));
  // }

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
      <React.Fragment>
        {
          this.state.loaded ? (
            this.state.collection.length !== 0 ? (
              <View style={styles.container}>
                <View style={styles.carouselContainer}>
                  <Carousel
                    ref={(c) => {
                      this._carousel = c;
                    }}
                    data={this.state.collection.images}
                    renderItem={this._renderItem}
                    onSnapToItem={(index) => this.setState({activeSlide: index})}
                    sliderWidth={Layout.window.width}
                    itemWidth={Layout.window.width - 40}
                  />
                </View>
                <View style={styles.collectionDetails}>
                  <Text><Text style={{fontWeight: "bold"}}>Name:</Text> {this.state.collection.name}</Text>
                  <Paragraph><Text style={{fontWeight: "bold"}}>Description:</Text> {this.state.collection.description}
                  </Paragraph>
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

Collection.propTypes = {
  collectionData: PropTypes.object,
  apiClient: PropTypes.object
};

const styles = StyleSheet.create({
  cardContent: {
    flex: 1,
  },
  card: {
    flex: 1,
  },
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
  collectionDetails: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 5,
    alignItems: 'flex-start',
    backgroundColor: '#ffffff'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }

});

export default Collection;
