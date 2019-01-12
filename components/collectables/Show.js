import React, {Component} from "react";
import {StyleSheet, View, Image, TouchableOpacity, ScrollView} from "react-native";
import {Divider, Headline, Paragraph, Text} from 'react-native-paper';
import ImageBrowser from 'react-native-interactive-image-gallery'

class Show extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Headline>Name of collectable</Headline>
        </View>
        <Divider />

        <View style={styles.collectable}>
            <Image
              style={styles.collectableImage}
              resizeMode='contain'
              source={{uri: 'https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8_100x100'}}
            />
            <ImageBrowser
              style={{flex: 1, backgroundColor: 'black'}}
              images={[
                {id: '1', URI: 'https://image-service-prod.pinster.io/9cc4e51b9d7f1c466103de7ca5dfef22_1000x1000',
                  thumbnail: 'https://image-service-prod.pinster.io/9cc4e51b9d7f1c466103de7ca5dfef22_300x300'},
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
    flex: 1,
    height: 100 + '%',
    width: 100 + '%'
  },
  header: {
    flex: 1,
    width: 100 + '%',
    height: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    marginTop: 5,
    marginBottom: 5,
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
  },
  touchableOpacity: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#535353',
    position: 'relative',
    // margin: 10
  }
});


export default Show;