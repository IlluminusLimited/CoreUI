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
      columns: 3,
    }
  };

  componentWillMount() {
    this._calculateNumberOfColumns();
  }

  componentDidMount() {
    this._executeQuery();
  }

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
          //TODO Show error dialog
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
        //TODO Show error dialog
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

  _buildCollectables = () => {
    const extraCells = this.state.collectables.length % this.state.columns;
    if (extraCells === 0) {
      return this.state.collectables;
    }
    const paddingCells = this.state.columns - extraCells;
    console.log("padding cells to make", paddingCells);
    const padding = [];
    for(let i = 0; i < paddingCells; i++) {
      padding.push({isPadding: true});
    }
    return [...this.state.collectables, ...padding]
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
                numColumns={this.state.columns}
                contentContainerStyle={styles.contentContainer}
                columnWrapperStyle={styles.row}
                data={this._buildCollectables()}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                onRefresh={this._handleRefresh}
                refreshing={this.state.refreshing}
                ListFooterComponent={this._renderFooter}
              />
            </View>
          ) : (
            <Text style={styles.noResults}>Your search query returned no results. Try something else.</Text>
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
    marginTop:50,
    marginBottom: 20,
    marginHorizontal: 10
  }
});

export default CollectableList;
