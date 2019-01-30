import React, {Component} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Appbar, Text, Card, Title, Paragraph} from 'react-native-paper';
import CollectableItem from "./CollectableItem";

class Collectables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 350,
        height: 350
      },
      collectables: [
        {
          id: "e4a91414-93cd-45c7-8ed8-4eaf21bf8813",
          name: "GFW Texas Mockingbird Appraiser Pin",
          year: 2018,
          description: "bird, grey, gray, flower, flowers, purple, white, green",
          tags: [],
          created_at: "2018-06-20T19:59:20.720Z",
          updated_at: "2018-06-20T19:59:20.720Z",
          images: [
            {
              id: "dc726746-3a9f-4b57-a006-afabc9b7f40b",
              featured: null,
              storage_location_uri: "https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8",
              thumbnailable: true,
              url: "https://api-prod.pinster.io/v1/images/dc726746-3a9f-4b57-a006-afabc9b7f40b"
            }
          ],
          url: "https://api-prod.pinster.io/v1/pins/e4a91414-93cd-45c7-8ed8-4eaf21bf8813"
        },
        {
          id: "1e11f363-9c9a-40b4-9f4f-ebe9a1e881cd",
          name: "GFW TX Monarch Butterfly Team Manager Pin",
          year: 2018,
          description: "orange, black, white, insect, bug",
          tags: [],
          created_at: "2018-06-20T19:57:24.822Z",
          updated_at: "2018-06-20T19:59:51.680Z",
          images: [
            {
              id: "83e7fc7c-65f8-478d-b0ff-fe5cc5d08b80",
              featured: null,
              storage_location_uri: "https://image-service-prod.pinster.io/2b134bff46eaba3c39c1e95fda2fffa2",
              thumbnailable: true,
              url: "https://api-prod.pinster.io/v1/images/83e7fc7c-65f8-478d-b0ff-fe5cc5d08b80"
            }
          ],
          url: "https://api-prod.pinster.io/v1/pins/1e11f363-9c9a-40b4-9f4f-ebe9a1e881cd"
        },
        {
          id: "24827946-f916-4669-b7c7-2eb008aa56d7",
          name: "Skeletal Dragon",
          year: 2018,
          description: "bronze, green, bone, skeleton",
          tags: [],
          created_at: "2018-06-20T19:55:34.593Z",
          updated_at: "2018-06-20T19:55:34.593Z",
          images: [
            {
              id: "37260c8f-90a3-408e-9819-201cfdb408d9",
              featured: null,
              storage_location_uri: "https://image-service-prod.pinster.io/c991bbd6078972794705da0dc557c318",
              thumbnailable: true,
              url: "https://api-prod.pinster.io/v1/images/37260c8f-90a3-408e-9819-201cfdb408d9"
            }
          ],
          url: "https://api-prod.pinster.io/v1/pins/24827946-f916-4669-b7c7-2eb008aa56d7"
        },
        {
          id: "c22028b3-d049-45eb-b4b0-437a5d0c8528",
          name: "Skeletal Dragon",
          year: 2018,
          description: "bronze, red, orange, bone, skeleton",
          tags: [],
          created_at: "2018-06-20T19:54:49.103Z",
          updated_at: "2018-06-20T19:54:49.103Z",
          images: [
            {
              id: "fe3d5505-c1c8-413a-87fc-9c84933df81c",
              featured: null,
              storage_location_uri: "https://image-service-prod.pinster.io/dd9c07260a28504abf7821815e0e0d82",
              thumbnailable: true,
              url: "https://api-prod.pinster.io/v1/images/fe3d5505-c1c8-413a-87fc-9c84933df81c"
            }
          ],
          url: "https://api-prod.pinster.io/v1/pins/c22028b3-d049-45eb-b4b0-437a5d0c8528"
        }
      ]
    }
  };


  render() {
    return (
      <View style={styles.container}>
        {Object.keys(this.state.collectables).map(key => (
          <CollectableItem
            key={key}
            uid={key}
            collectableData={this.state.collectables[key]}
          />
        ))}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'blue',
    justifyContent: 'space-around'
  },
  collectableItem: {
    backgroundColor: 'yellow',
    width: 100
  },
  image: {
    aspectRatio: 1,
    backgroundColor: 'black',
    resizeMode: 'contain'
  }
});

export default Collectables;
