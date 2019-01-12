import React, {Component} from "react";
import {StyleSheet, View , Image, TouchableOpacity, ScrollView} from "react-native";
import {Divider, Headline, Paragraph, Text} from 'react-native-paper';

class Show extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Headline>Name of collectable</Headline>
        </View>

        <View style={styles.collectable}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.touchableOpacity}
          >
            <Image
              style={styles.collectableImage}
              resizeMode='contain'
              source={{uri: 'https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8_100x100'}}
            />
          </TouchableOpacity>
        </View>
        <Divider />
        <Text>Description</Text>
        <Paragraph>
          Some long winded description of this pin.
        </Paragraph>

        <View style={styles.collectableImageGallery}>
          <View style={styles.collectableImages}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.touchableOpacity}
            >
              <Image
                style={styles.collectableGalleryImage}
                source={{uri: 'https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8_100x100'}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.touchableOpacity}
            >
              <Image
                style={styles.collectableGalleryImage}
                source={{uri: 'https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8_100x100'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>


    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    height: 100 + '%',
    width: 100 + '%'
  },
  header: {
    flex: 1,
    width: 100 + '%',
    height: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
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