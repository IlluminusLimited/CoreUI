import React, {Component} from 'react';
import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View, Platform, FlatList} from 'react-native';
import {Collectables} from "./Collectables";
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import * as StatusBar from "react-native";

export default class Home extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null
    };
  };

  DEFAULT_PAGE_LINK = 'https://api-dev.pinster.io/v1/pins?page%5Bsize%5D=15';

  state = {
    query: '',
    pageLink: this.DEFAULT_PAGE_LINK,
    loading: false
  };

  _executeSearch = async () => {
    this.setState({loading: true});

    if (this.state.query === '' || this.state.query === null || this.state.query === undefined) {
      return this.setState({
        pageLink: this.DEFAULT_PAGE_LINK,
        loading: false
      })
    }
    let url = new URL('https://api-dev.pinster.io/v1/search');
    const params = {query: this.state.query};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    this.setState({
      pageLink: url.toString(),
      loading: false,
    })
  };


  render() {
    return (
      <View style={styles.container}>
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
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <Collectables pageLink={this.state.pageLink} />
        )}
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'brown'
  },
  searchBar: {
    paddingTop: 2,
    paddingHorizontal: 5,
    backgroundColor: 'green',
  },
  contentContainer: {
    paddingTop: 10,
  },
  activityIndicator: {
    backgroundColor: 'purple',
  }
});
