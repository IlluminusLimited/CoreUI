import React, {Component} from "react";
import {StyleSheet, View, Text, Image} from "react-native";

class Partial extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width: 100 + '%', height: 100 + '%'}}
          source={{uri: 'https://image-service-prod.pinster.io/2d0ca427033b0ca59b960ad68ce481c8_100x100'}}
        />
        <Text>Stuff</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 100 + '%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default Partial;