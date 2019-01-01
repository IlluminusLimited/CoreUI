import React, {Component} from "react";
import {StyleSheet, View, Text, Image} from "react-native";
import CollectableItem from "./CollectableItem";

class Collectable extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>Things</Text>
        </View>
        <CollectableItem />
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
    backgroundColor: '#ff332f',
    borderBottomColor: '#244',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default Collectable;