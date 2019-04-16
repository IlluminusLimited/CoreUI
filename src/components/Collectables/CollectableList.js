import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import CollectableItem from "./CollectableItem";
import PropTypes from "prop-types";
import LoadMoreButton from "../LoadMoreButton";
import {ActivityIndicator} from "react-native-paper";

export class CollectableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectables: [],
      pageLink: this.props.pageLink,
      nextPage: '',
      loading: false,
      loadingMore: false,
      refreshing: false,
    }
  };

  componentDidMount() {
    this._executeQuery();
  }

  _executeQuery = async () => {
    this.setState({
      loading: true,
    });
    fetch(this.state.pageLink)
      .then(
        results => {
          return results.json();
        },
        error => {
          console.error("Failed to process collectables", error);
          this.setState({
            loading: false,
            refreshing: false
          })
        }
      )
      .then(response => {
        // console.log(`Fetch returned:`, response);
        // Display the pins
        if (response.data[0] && response.data[0].searchable_type) {
          let allPromises = response.data.map(searchable => {
            return fetch(searchable.url)
              .then(
                results => {
                  return results.json();
                },
                error => {
                  console.error("Failed to process searchable result.", error);
                }
              )
              .then(innerResponse => {
                this.setState(prevState => {
                  return {
                    collectables: [...prevState.collectables, innerResponse],
                    nextPage: response.links.next ? response.links.next : ''
                  };
                });
              });
          });
          Promise.all(allPromises).then(() => {
            this.setState({
              loading: false,
              refreshing: false,
            });
          });
        }
        else {
          this.setState({
            loading: false,
            refreshing: false,
            collectables: response.data,
            nextPage: response.links.next ? response.links.next : ''
          });
        }
      }).catch(error => {
      console.error("There was a really bad error while getting collectables.", error);
    });
  };


  _executeLoadMore = async () => {
    fetch(this.state.nextPage)
      .then(
        results => {
          return results.json();
        },
        error => {
          console.error("Failed to process loadMore request.", error);
          this.setState({
            loadingMore: false
          })
        }
      )
      .then(response => {
        // console.log(`Fetch More returned:`, response);
        // Display the pins
        if (response.data[0] && response.data[0].searchable_type) {
          let allPromises = response.data.map(searchable => {
            return fetch(searchable.url)
              .then(
                results => {
                  return results.json();
                },
                error => {
                  console.error("Failed to process searchable result.", error);
                }
              )
              .then(innerResponse => {
                this.setState(prevState => {
                  return {
                    collectables: [...prevState.collectables, innerResponse],
                    nextPage: response.links.next ? response.links.next : ''
                  };
                });
              });
          });
          Promise.all(allPromises).then(() => {
            this.setState({
              loadingMore: false
            });
          });
        }
        else {
          this.setState(prevState => {
            return {
              loadingMore: false,
              collectables: [...prevState.collectables, ...response.data],
              nextPage: response.links.next ? response.links.next : ''
            }
          });
        }
      }).catch(error => console.error("There was a really bad error while loading more collectables.", error));
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
    <CollectableItem collectableData={item} />
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

  _calculateNumberOfColumns = () => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    let workingDimension = width;
    if (width > height) {
      workingDimension = height;
    }

    //TODO: Make this aware of the collectable width.
    let columns = Math.floor(workingDimension / 110);
    console.log(`Calculated columns to be: ${columns} from width: ${width} and height: ${height}`)
    return columns;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          this.state.collectables.length !== 0 ? (
            <View style={styles.container}>
              <FlatList
                numColumns={this._calculateNumberOfColumns()}
                contentContainerStyle={styles.contentContainer}
                columnWrapperStyle={styles.row}
                data={this.state.collectables}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                onRefresh={this._handleRefresh}
                refreshing={this.state.refreshing}
                ListFooterComponent={this._renderFooter}
              />
            </View>
          ) : (
            <Text>Your search query returned no results. Try something else.</Text>
          )
        )}
      </View>
    );
  }
}

CollectableList.propTypes = {
  pageLink: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingVertical: 50,
  }
});

export default CollectableList;
