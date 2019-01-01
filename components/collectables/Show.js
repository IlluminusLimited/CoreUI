import React, {Component} from "react";
import {StyleSheet, View, Text, Image} from "react-native";
import Partial from "./Partial";

class Show extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>Name of collectable</Text>
        </View>
        <View style={styles.collectable}>
          <Image
            style={{width: 100 + '%', height: 100 + '%'}}
            source={{uri: 'https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8_100x100'}}
          />
          <Text>Stuff</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 100 + '%',
    height: 100 + '%'
  },
  header: {
    width: 100 + '%',
    height: 50,
    borderBottomColor: '#244',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  collectable: {
    width: 100 + '%',
    height: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default Show;