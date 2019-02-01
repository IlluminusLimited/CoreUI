import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from "react-native-paper";
import {Ionicons} from "react-native-vector-icons";
import {Collectables} from "../components/Collectables";

export default class Collections extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null
    };
  };

  state = {
    loaded: false,
    collections: []
  };

  componentDidMount() {
    this._fetchPins();
  }

  _fetchPins() {
    fetch('https://api-dev.pinster.io/v1/collections?page%5Bsize%5D=15')
      .then(results => {
        console.log(results);
        return results.json()
      })
      .then(collections => {
        console.log(collections);
        this.setState({
          collections: collections.data,
          loaded: true
        })
      })
      .catch(error => console.error('error getting collections', error));
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          {this.state.loaded ? (
            this.state.collectables.length !== 0 ? (
              <Collectables collectableData={this.state.collectables} navigation={this.props.navigation} />
            ) : (
              <Text>Your search query returned no results. Try something else.</Text>
            )
          ) : (
            <Text>LOADING ZOMG</Text>
          )}
        </ScrollView>
      </View>
    );
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
