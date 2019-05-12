import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import CollectionItem from "./CollectionItem";
import PropTypes from "prop-types";
import LoadMoreButton from "../LoadMoreButton";
import {ActivityIndicator} from "react-native-paper";
import ApiClient from "../../utilities/ApiClient";
import CurrentUserProvider from "../../utilities/CurrentUserProvider";

export class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: [],
      pageLink: this.props.pageLink,
      nextPage: '',
      loading: false,
      loadingMore: false,
      refreshing: false,
      columns: 3,
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log("Props to collectionList: ", nextProps);
    if (nextProps.shouldRefresh) {
      console.log("List Got refresh props!");
      this._handleRefresh();
    }
  }

  componentWillMount() {
    this._calculateNumberOfColumns();
  }

  componentDidMount() {
    this._loadUser().then(this._executeQuery)
  }

  _loadUser = async () => {
    return CurrentUserProvider.loadUser().then(currentUser => {
      console.debug("User:", currentUser);
      if (!currentUser.isLoggedIn()) {
        //TODO: Give the user some reason why they need to auth.
        console.log("No logged in user. Redirecting to auth");
        return this.props.navigation.navigate('Auth');
      }
      return this.setState({
        currentUser,
        loading: false
      });
    }).catch(error => {
      //TODO: Show dialog that lets them choose whether to reload or auth again
      console.log("Error loading user. Redirecting to auth", error);
      return this.props.navigation.navigate('Auth');
    })
  };

  _calculateNumberOfColumns = () => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    let workingDimension = width;
    if (width > height) {
      workingDimension = height;
    }

    //TODO: Make this aware of the collection width.
    let columns = Math.floor(workingDimension / 110);
    console.log(`Calculated columns to be: ${columns} from width: ${width} and height: ${height}`);
    this.setState({
      columns: columns
    });
  };

  _executeQuery = async () => {
    this.setState({
      loading: true,
    });

    new ApiClient(this.state.currentUser).get(this.state.pageLink,
      (error) => {
        console.log("Auth failure was called with", error);
        this.props.navigation.navigate("Auth");
      }
    ).then(json => {
        console.log("CollectionList:", json.data);
        this.setState({
          loading: false,
          refreshing: false,
          collections: json.data,
          nextPage: json.links.next ? json.links.next : ''
        });
      }
    ).catch(error => {
      console.error("There was a really bad error while getting collections.", error);
    });
  };


  _executeLoadMore = async () => {
    new ApiClient(this.state.currentUser).get(this.state.nextPage)
      .then(json => {
        this.setState(prevState => {
          return {
            loadingMore: false,
            collections: [...prevState.collections, ...json.data],
            nextPage: json.links.next ? json.links.next : ''
          }
        });
      }).catch(error => console.error("There was a really bad error while loading more collections.", error));
  };

  _loadMore = async () => {
    if (this.state.nextPage === '' || this.state.nextPage === null || this.state.nextPage === undefined) {
      return this.setState({
        loadingMore: false,
      });
    }
    this.setState({
        loadingMore: true
      },
      this._executeLoadMore
    )
  };

  _renderItem = ({item}) => (
    <CollectionItem collectionData={item} />
  );

  _keyExtractor = (item) => item.id;

  _handleRefresh = () => {
    this.setState(
      {
        nextPage: '',
        refreshing: true
      },
      this._executeQuery
    );
  };

  _renderFooter = () => {
    return (
      <LoadMoreButton style={styles.loadMore} nextPage={this.state.nextPage} fetchMoreItems={this._loadMore} />
    );
  };

  _buildCollections = () => {
    const extraCells = this.state.collections.length % this.state.columns;
    if (extraCells === 0) {
      return this.state.collections;
    }
    const paddingCells = this.state.columns - extraCells;
    console.log("padding cells to make", paddingCells);
    const padding = [];
    for (let i = 0; i < paddingCells; i++) {
      padding.push({isPadding: true});
    }
    return [...this.state.collections, ...padding]
  };


  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          this.state.collections.length !== 0 ? (
            <View style={styles.container}>
              <FlatList
                numColumns={this.state.columns}
                contentContainerStyle={styles.contentContainer}
                columnWrapperStyle={styles.row}
                data={this._buildCollections()}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                onRefresh={this._handleRefresh}
                refreshing={this.state.refreshing}
                ListFooterComponent={this._renderFooter}
              />
            </View>
          ) : (
            <Text style={styles.noResults}>It doesn't look like there's anything here. You should make a
              collection.</Text>
          )
        )}
      </View>
    );
  }
}

CollectionList.propTypes = {
  pageLink: PropTypes.string.isRequired,
  shouldRefresh: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noResults: {
    paddingHorizontal: 5,
  },
  contentContainer: {
    flexDirection: 'column',
  },
  row: {
    paddingTop: 5,
    flex: 1,
    justifyContent: 'space-around'
  },
  activityIndicator: {
    marginTop: 200,
  },
  loadMore: {
    flex: 1,
    marginTop: 50,
    marginBottom: 20,
    marginHorizontal: 10
  }
});

export default CollectionList;
