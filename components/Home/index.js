import React, {Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Collectables from "../Collectables";

export default class Home extends Component {
  static navigationOptions = {
    header: null
  };
  state = {
    pins: []
  };

  componentDidMount() {
    this._doThing();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >

          {this.state.loaded ? (
            this.state.pins.length !== 0 ? (
              <Collectables collectableData={this.state.pins}/>
            ) : (
              <Text>Your search query returned no results. Try something else.</Text>
            )
          ) : (
            <Text>Fuck you</Text>
          )}
        </ScrollView>
      </View>
    );
  }

  _doThing() {
    fetch('https://api-dev.pinster.io/v1/pins?page%5Bsize%5D=10')
      .then(
        results => {
          return results.json();
        },
        error => {
          console.error(error);
        }
      )
      .then(pins => {
        console.log(pins);
        this.setState({
          pins: pins.data,
          loaded: true
        });
      });
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingTop: 10
  },
});
