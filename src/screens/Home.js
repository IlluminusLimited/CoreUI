import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import CollectableList from "../components/Collectables/CollectableList";

export default class Home extends Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null
    };
  };

  //TODO: Parameterize the host portion of the url
  DEFAULT_URL = 'https://api-prod.pinster.io/v1/pins?page%5Bsize%5D=25';
  DEFAULT_SEARCH_URL = 'https://api-prod.pinster.io/v1/search';

  state = {
    query: '',
    pageLink: this.DEFAULT_URL,
    loading: false
  };

  _executeSearch = async () => {
    console.log("Search execute");
    if (this.state.query === '' || this.state.query === null || this.state.query === undefined) {
      console.log("Search query was empty, loding default view.");
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
    this.setState(state => ({...state, query: query || ''}))
  };

  _handleSearchCancel = () => {
    console.log("Search cancel");
    this._handleQueryChange('')

  };

  _handleSearchClear = () => {
    console.log("Search clar");
    this._handleQueryChange('')
      .then(this._handleSearch)
  };


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Search"
            onChangeText={this._handleQueryChange}
            onClear={this._handleSearchClear}
            onCancel={this._handleSearchCancel}
            onIconPress={this._handleSearch}
            onEndEditing={this._handleSearch}
            value={this.state.query}
          />
        </View>
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <CollectableList pageLink={this.state.pageLink} />
        )}
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === "android" ? ((StatusBar.currentHeight === null ||
      StatusBar.currentHeight === undefined) ? 25 : StatusBar.currentHeight) : 0
  },
  searchBar: {
    paddingTop: 2,
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  activityIndicator: {
    marginTop: 200,
  }
});
