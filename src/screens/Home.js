import React, {Component} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, SafeAreaView} from 'react-native';
import {Collectables} from "./Collectables";
import {ActivityIndicator} from 'react-native-paper'

export default class Home extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null
    };
  };

  state = {
    loaded: false,
    refreshing: false,
    collectables: []
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this._fetchPins().then(() => {
      this.setState({refreshing: false});
    });
  };

  componentDidMount() {
    this._fetchPins();
  }

  _fetchPins = async () => {
    fetch('https://api-dev.pinster.io/v1/pins?page%5Bsize%5D=15')
      .then(results => results.json())
      .then(collectables => {
        console.log(collectables);
        this.setState({
          collectables: collectables.data,
          loaded: true
        })
      })
      .catch(error => console.error('error getting all pins', error));
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          {this.state.loaded ? (
            this.state.collectables.length !== 0 ? (
              <Collectables collectableData={this.state.collectables} />
            ) : (
              <Text>Your search query returned no results. Try something else.</Text>
            )
          ) : (
            <ActivityIndicator style={styles.activityIndicator} />
          )}
        </ScrollView>
      </SafeAreaView>
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
  activityIndicator: {
    marginTop: 200
  }
});
