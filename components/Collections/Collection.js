import React, {Component} from "react";
import {StyleSheet, View, Text} from "react-native";

class Collection extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>Things</Text>
        </View>
        <Partial />
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
    backgroundColor: '#5fffe9', //Eventually this will be the Collections's color as set by the user
    borderBottomColor: '#244',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default Collection;