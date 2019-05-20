import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Paragraph, Surface, Text} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import PropTypes from 'prop-types'
import Layout from "../../constants/Layout";
import ImageServiceImage from "../../components/ImageServiceImage";
import Favoriteable from "../../components/Favoriteable";
import FeaturedImageList from "../../utilities/FeaturedImageList";
import PropsHelper from "../../utilities/PropsHelper";
import GfLogo from "../../components/GfLogo";
import {UserContext} from "../../contexts/UserContext";

//A Collectable component can be initialized with either an ID or all of the relevant information
class Collectable extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: navigation.getParam('collectable', '').name,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      collectable: PropsHelper.extract(this.props, 'collectable'),
      activeSlide: 0,
      favorite: 'unchecked',
    };
  }

//TODO: Add event listener to auto refresh when we view this page again

  _renderItem = ({item, index}) => {
    return (
      <ImageServiceImage
        style={styles.image}
        imageData={item}
        dimensions={'1000x1000'}
      />
    );
  };

  _authNavigate = () => {
    this.props.navigation.navigate('Auth')
  };

  render() {
    return (
      <UserContext.Consumer>
        {userContext => (
          <CollectableContent
            currentUser={userContext.currentUser}
            loaded={this.state.loaded}
            collectable={this.state.collectable}
            renderItem={this._renderItem}
            onSnapToItem={(index) => this.setState({activeSlide: index})}
          />
        )}
      </UserContext.Consumer>
    )
  }
}

// Carousel sliderWidth and itemWidth are important, if you change the stylesheet make sure this
// still a valid setup.
// TODO: Conditionally change the itemWidth property based on pagination. I think using the preview
// function of the slider eliminates the need for a pagination element.
function CollectableContent(props) {
  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          data={FeaturedImageList.sortImages(props.collectable.images)}
          renderItem={props.renderItem}
          onSnapToItem={props.onSnapToItem}
          sliderWidth={Layout.window.width}
          itemWidth={Layout.window.width - 40}
        />
      </View>
      <View style={styles.collectableDetails}>
        <Favoriteable
          style={styles.favoriteable}
          currentUser={props.currentUser}
          collectable={props.collectable}
          buttonColor={styles.favoriteableButton.color} />
        <Surface style={styles.surface}>
          <GfLogo year={props.collectable.year} />
          <View style={styles.collectionDetailContainer}>
            <Text style={styles.collectionDetail} numberOfLines={1}><Text
              style={styles.collectionDetailBold}>Name:</Text> {props.collectable.name}</Text>
            <Paragraph style={styles.collectionDetail} numberOfLines={3}><Text
              style={styles.collectionDetailBold}>Description:</Text> {props.collectable.description}
            </Paragraph>
          </View>
        </Surface>
      </View>
    </View>
  )
}

Collectable.propTypes = {
  //This can't be required because it doesn't come is as a prop, it comes in as navigation!
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
  favoriteable: {
    flex: 2,
  },
  favoriteableButton: {
    color: '#c81d25'
  },
  collectionDetail: {
    // fontSize: 16
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
    padding: 15,
    margin: 0,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  collectionDetailContainer: {
    flex: 4,
    marginLeft: 5,
    justifyContent: 'center'
  },


});

export default Collectable;
