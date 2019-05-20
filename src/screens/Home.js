import React, {Component} from 'react';
import {Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Searchbar} from 'react-native-paper';
import CollectableList from "../components/Collectables/CollectableList";
import ENV from "../utilities/Environment.js"
import Colors from "../constants/Colors";
import CollectableItem from "../components/Collectables/CollectableItem";
import CollectableBigItem from "../components/Collectables/CollectableBigItem";
import {UserContext} from "../contexts/UserContext";

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

  _calculateNumberOfColumns = () => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    let workingDimension = width;
    if (width > height) {
      workingDimension = height;
    }

    //TODO: Make this aware of the collectable width.
    let columns = Math.floor(workingDimension / 110);
    console.log(`Calculated columns to be: ${columns} from width: ${width} and height: ${height}`);
    this.setState({
      columns: columns
    });
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

  _renderItem = ({item, index, section}) => (
    <CollectableBigItem collectable={item} />
  );

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
          <UserContext.Consumer>
            {userContext => (
              <CollectableList
                currentUser={userContext.currentUser}
                style={styles.collectableList}
                pageLink={this.state.pageLink}
                sectionHeaderStyle={styles.sectionHeader}
                renderItem={this._renderItem}
                columns={1} />
              //    Make this columns use the math above
            )}
          </UserContext.Consumer>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader:
    {
      height: 35,
      backgroundColor: Colors.turquoise,
      flex: 1,
      // borderTopWidth: 0.5,
      // borderBottomWidth: 0.5,
      // borderColor: '#808080',
      justifyContent: 'center',
      alignItems: 'center'
    }
});
