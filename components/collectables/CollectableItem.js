import React, {Component} from "react";
import {StyleSheet, View, Text, Image} from "react-native";

class CollectableItem extends Component {

  render() {
    return (
      <View>
        <Text>Stuff</Text>
        <Image
          style={{width: 100, height: 100}}
          source={{uri: 'https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8_1000x1000'}}
        />
      </View>
    )
  }
}


export default CollectableItem;