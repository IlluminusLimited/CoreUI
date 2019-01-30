import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, Text, Card, Title, Paragraph} from 'react-native-paper';
import Carousel from "react-native-snap-carousel";

class Collectables extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 350,
        height: 350
      },
      entries: [{
        text: "bob",
        image: 'https://image-service-prod.pinster.io/9cc4e51b9d7f1c466103de7ca5dfef22_1000x1000'
      },
        {
          text: "fucker",
          image: 'http://i.imgur.com/XP2BE7q.jpg'
        }]
    };
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
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar} statusBarHeight={0}>
          <Appbar.BackAction onPress={console.log('Back button pressed')} />
          <Appbar.Content
            title={'Name of collectable'}
            subtitle={
              'Some long winded desFUCK YOUcription maybe asdfadsf asdfas dasd asdf asdfasdf asdf asfasd fs'
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
        </View>

        <Text>Description</Text>
        <Paragraph>Some long winded description of this pin.</Paragraph>
      </View>
    );
  }
}

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

export default Collectables;
