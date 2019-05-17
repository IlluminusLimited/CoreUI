import React, {Component} from 'react';
import {Platform, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import CollectableList from "../components/Collectables/CollectableList";
import ENV from "../utilities/Environment.js"
import Colors from "../constants/Colors";

export default class Home extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null,
      headerStyle: {
        backgroundColor: Colors.turquoise
      },
      headerTitleStyle: {
        color: '#fff'
      }
    };
  };

  //TODO: Parameterize the host portion of the url
  DEFAULT_URL = `${ENV.API_URI}/v1/pins?page%5Bsize%5D=${ENV.PAGE_SIZE}`;
  DEFAULT_SEARCH_URL = `${ENV.API_URI}/v1/search?page%5Bsize%5D=${ENV.PAGE_SIZE}`;

  state = {
    query: '',
    pageLink: this.DEFAULT_URL,
    loading: false
  };

  _executeSearch = async () => {
    console.log("Search execute");
    if (this.state.query === '' || this.state.query === null || this.state.query === undefined) {
      console.log("Search query was empty, loading default view.");
      return this.setState({
        pageLink: this.DEFAULT_URL,
        loading: false
      })
    }
    let url = new URL(this.DEFAULT_SEARCH_URL);
    const params = {query: this.state.query};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    console.log("Generated url:", url);
    this.setState({
      pageLink: url.toString(),
      loading: false,
    });
  };

  _handleSearch = () => {
    this.setState(() => ({
        loading: true
      }),
      () => {
        return this._executeSearch();
      }
    );
  };

  _handleQueryChange = (query) => {
    this.setState(state => ({...state, query: query || ''}),
      () => {
        if (this.state.query === '') {
          this._handleSearchClear();
        }
      });
  };

  _handleSearchClear = () => {
    console.log("Search clear");
    this._handleSearch();
  };


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Search"
            onChangeText={this._handleQueryChange}
            onIconPress={this._handleSearch}
            onEndEditing={this._handleSearch}
            value={this.state.query}
          />
        </View>
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <CollectableList style={styles.collectableList} pageLink={this.state.pageLink} />
        )}
      </SafeAreaView>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.turquoise,
    paddingTop: Platform.OS === "android" ? ((StatusBar.currentHeight === null || StatusBar.currentHeight === undefined) ? 25 : StatusBar.currentHeight) : 0
  },
  searchBar: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  collectableList: {
    flex: 1,
    backgroundColor: '#fff'
  },
  activityIndicator: {
    marginTop: 200,
  }
});
