import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Paragraph, Text} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import PropTypes from 'prop-types'
import Layout from "../../constants/Layout";
import ImageServiceImage from "../../components/ImageServiceImage";
import ENV from "../../utilities/environment";
import Favoriteable from "../../components/Favoriteable";

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
      activeSlide: 0,
      favorite: 'unchecked',
    };
  }

  componentDidMount() {
    this._fetchCollectable();
  }

  _fetchCollectable() {
    //TODO: Parameterize the host portion of the url
    fetch(`${ENV.API_URI}/pins/${this.state.collectableId}`)
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

  _renderItem({item, index}) {
    return (
      <ImageServiceImage style={styles.image} imageData={item} dimensions={'1000x1000'} />
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
                <Favoriteable collectableId={this.state.collectableId} />
                <View style={styles.collectableDetails}>
                  <Text><Text style={{fontWeight: "bold"}}>Name:</Text> {this.state.collectable.name}</Text>
                  <Paragraph><Text style={{fontWeight: "bold"}}>Description:</Text> {this.state.collectable.description}
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
    paddingTop: 5,
    paddingHorizontal: 5,
    alignItems: 'flex-start',
    backgroundColor: '#ffffff'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favorite: {
    height: 48,
    width: 48,
    right: 0
  }

});

export default Collectable;
