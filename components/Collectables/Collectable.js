import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, Text, Card, Title, Paragraph} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";
import PropTypes from 'prop-types'

//A Collectable component can be initialized with either an ID or all of the relevant information
class Collectable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collectable: {},
      loaded: false
    };
  }

  componentDidMount() {
    this._fetchCollectable();
  }

  _fetchCollectable() {
    fetch(`https://api-dev.pinster.io/v1/pins/${this.props.collectableId}`)
      .then(response => response.json())
      .then(collectable => {
        console.log(collectable);
        this.setState({
          collectable: collectable.data,
          loaded: true
        });
      })
      .catch(error => console.error('error getting collectable', error));
  }


  _renderItem({item, index}) {
    return (
      <Card style={styles.card}>
        <Card.Cover source={{uri: item.image}} />
        <Card.Content style={styles.cardContent}>
          <Title>{item.text}</Title>
          <Paragraph>Card content</Paragraph>
        </Card.Content>
      </Card>
    );
  }


  render() {
    return (
      <React.Fragment>
        {
          this.state.loaded ? (
            this.state.collectable.length !== 0 ? (
              <View style={styles.container}>
                <Appbar.Header style={styles.appbar} statusBarHeight={0}>
                  <Appbar.BackAction onPress={console.log('Back button pressed')} />
                  <Appbar.Content
                    title={'Name of collectable'}
                    subtitle={
                      'Some long winded description maybe'
                    }
                  />
                </Appbar.Header>

                <View style={styles.collectable}>
                  <Carousel
                    ref={(c) => {
                      this._carousel = c;
                    }}
                    data={this.state.entries}
                    renderItem={this._renderItem}
                    sliderWidth={this.state.viewport.width}
                    itemWidth={this.state.viewport.width}
                  />

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
  collectableId: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  cardContent: {},
  card: {
    marginTop: 5,
    marginBottom: 5
  },
  container: {
    flex: 1
  },
  appbar: {
    flex: 1
  },
  collectable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'black'
  },
  collectableImages: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#8c2430',
    marginLeft: 5,
    marginRight: 5
  },
  collectableImage: {
    flex: 1,
    aspectRatio: 1.8
  },
  collectableImageGallery: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  collectableGalleryImage: {
    flex: 1,
    aspectRatio: 1.0,
    margin: 10
  }
});

export default Collectable;
