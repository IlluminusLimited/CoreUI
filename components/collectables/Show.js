import React, {Component} from "react";
import {StyleSheet, View, Image, TouchableOpacity, ScrollView} from "react-native";
import {Appbar, Divider, Headline, Paragraph, Subheading, Text} from 'react-native-paper';
import ImageBrowser from 'react-native-interactive-image-gallery'

class Show extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar} statusBarHeight={0}>
          <Appbar.BackAction
            onPress={console.log("Back button pressed")}
          />
          <Appbar.Content title={"Name of collectable"} subtitle={"Some long winded description maybe asdfadsf asdfas dasd asdf asdfasdf asdf asfasd fs"} />
        </Appbar.Header>

        <View style={styles.collectable}>
          <ImageBrowser
            style={{flex: 1, backgroundColor: 'black'}}
            images={[
              {
                id: '1', URI: 'https://image-service-prod.pinster.io/9cc4e51b9d7f1c466103de7ca5dfef22_1000x1000',
                thumbnail: 'https://image-service-prod.pinster.io/9cc4e51b9d7f1c466103de7ca5dfef22_300x300'
              },
            ]}
          />
        </View>
        <Divider />
        <Text>Description</Text>
        <Paragraph>
          Some long winded description of this pin.
        </Paragraph>

        <View style={styles.collectableImageGallery}>
          <ImageBrowser
            style={{flex: 1, backgroundColor: 'black'}}
            images={[
              {id: '1', URI: 'http://i.imgur.com/XP2BE7q.jpg', thumbnail: 'http://i.imgur.com/XP2BE7q.jpg'},
              {id: '2', URI: 'http://i.imgur.com/5nltiUd.jpg', thumbnail: 'http://i.imgur.com/5nltiUd.jpg'},
            ]}

          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  appbar: {
    flex: 1,
  },
  collectable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
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
    justifyContent: 'flex-end',
  },
  collectableGalleryImage: {
    flex: 1,
    aspectRatio: 1.0,
    margin: 10
  }
});


export default Show;