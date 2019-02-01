import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, Text, Card, Title, Paragraph} from 'react-native-paper';
import Carousel, {Pagination} from "react-native-snap-carousel";
import PropTypes from 'prop-types'
import Layout from "../../constants/Layout";

//A Collectable component can be initialized with either an ID or all of the relevant information
class Collectable extends Component {

  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('collectableName', ''),
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
    fetch(`https://api-dev.pinster.io/v1/pins/${this.state.collectableId}`)
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
      <Card style={styles.card}>
        <Card.Cover source={{uri: item.storage_location_uri + '_1000x1000'}} />
        <Card.Content style={styles.cardContent}>
          <Title>asdfasgegegedf{item.name}</Title>
          <Paragraph>sadfadsfadsf{item.description}</Paragraph>
        </Card.Content>
      </Card>
    );
  }

  _renderPagination() {
    const {collectable, activeSlide} = this.state;
    return (
      <Pagination
        dotsLength={collectable.images.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.carouselPagination}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
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
                    data={this.state.collectable.images}
                    renderItem={this._renderItem}
                    onSnapToItem={(index) => this.setState({activeSlide: index})}
                    sliderWidth={Layout.window.width}
                    itemWidth={Layout.window.width - 40}
                  />
                  {/*{this._renderPagination()}*/}
                </View>
                <View style={styles.collectableDetails}>
                  <Text>Name: {this.state.collectable.name}</Text>
                  <Paragraph>Description: {this.state.collectable.description}</Paragraph>
                </View>
              </View>
            ) : (
              <Text>There was an error getting shit</Text>
            )
          ) : (
            <Text>Loading</Text>
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
  carouselPagination: {
  },
  collectableDetails: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'blue'
  }
});

export default Collectable;
