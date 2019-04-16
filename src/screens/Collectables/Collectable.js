import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Paragraph, Text, ActivityIndicator} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import PropTypes from 'prop-types'
import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors"

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
    this.state = {
      collectableId: (collectableId ? collectableId : this.props.collectableId),
      collectable: {},
      loaded: false,
      activeSlide: 0
    };
  }

  componentDidMount() {
    this._fetchCollectable();
  }

  _fetchCollectable() {
    //TODO: Parameterize the host portion of the url
    fetch(`https://api-prod.pinster.io/v1/pins/${this.state.collectableId}`)
      .then(response => response.json())
      .then(collectable => {
        console.log("We got back this thing", collectable);
        this.props.navigation.setParams({collectableName: collectable.name});
        this.setState({
          collectable: collectable,
          loaded: true
        });
      })
      .catch(error => console.error('error getting collectable', error));
  }

  //TODO: Implement check for thumbnailable before asking for specific image size
  //TODO: image name and description are hidden in the api, need to populate those fields before this will work.
  //TODO: Card content gets hidden when pagination happens.
  _renderItem({item, index}) {
    return (
      <Image style={styles.image} source={{uri: item.storage_location_uri + '_1000x1000'}} />
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
                    data={this.state.collectable.images}
                    renderItem={this._renderItem}
                    onSnapToItem={(index) => this.setState({activeSlide: index})}
                    sliderWidth={Layout.window.width}
                    itemWidth={Layout.window.width - 40}
                  />
                </View>
                <View style={styles.collectableDetails}>
                  <Text>Name: {this.state.collectable.name}</Text>
                  <Paragraph>Description: {this.state.collectable.description}</Paragraph>
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
  collectableDetails: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#ffffff'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }

});

export default Collectable;
