import React, {Component} from 'react';
import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View, Platform} from 'react-native';
import {Collectables} from "./Collectables";
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import * as StatusBar from "react-native";

export default class Home extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null
    };
  };

  state = {
    loaded: false,
    refreshing: false,
    collectables: [],
    query: ''
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
    fetch('https://api-dev.pinster.io/v1/pins?page%5Bsize%5D=25')
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

  _executeSearch = async () => {
    let url = new URL('https://api-dev.pinster.io/v1/search');
    const params = {query: this.state.query};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    fetch(url)
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
      <View style={styles.container}>
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
          <View style={styles.searchBar}>
            <Searchbar
              placeholder="Search"
              onChangeText={query => {
                this.setState({query: query});
              }}
              onEndEditing={this._executeSearch}
              value={this.state.query}

            />
          </View>
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
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 5,
  },
  contentContainer: {
    paddingTop: 10,
  },
  activityIndicator: {
    marginTop: 200,
  }
});
