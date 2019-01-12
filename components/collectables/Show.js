import React, {Component} from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity, ScrollView} from "react-native";

class Show extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>Name of collectable</Text>
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
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 360}}>
          <View style={styles.collectableImages}>
            <Image
              style={styles.collectableGalleryImage}
              source={{uri: 'https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8_100x100'}}
            />
            <Image
              style={styles.collectableGalleryImage}
              source={{uri: 'https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8_100x100'}}
            />
          </View>
        </View>
      </View>


    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue'
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
    position: 'relative',
    marginLeft: 5,
    marginRight: 5
  },
  collectableImage: {
    flex: 1,
    aspectRatio: 1.8
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