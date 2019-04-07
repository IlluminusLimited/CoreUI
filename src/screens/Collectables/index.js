import React, {Component} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import CollectableItem from "../../components/Collectables/CollectableItem";
import PropTypes from "prop-types";
import LoadMoreButton from "../../components/LoadMoreButton";
import {ActivityIndicator} from "react-native-paper";

export class Collectables extends Component {
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

  //
  // _fetchPins = async () => {
  //   // this.setState({loaded: false});
  //   console.log(`Fetching pins from: ${this.state.pageLink}`);
  //   fetch(this.state.pageLink)
  //     .then(
  //       results => {
  //         return results.json();
  //       },
  //       error => {
  //         console.error(error);
  //         this.setState({loaded: true})
  //       }
  //     )
  //     .then(response => {
  //       console.log(`Fetching more pins got: ${response}`);
  //       // Display the pins
  //       this.setState(prevState => {
  //         return {
  //           loaded: true,
  //           collectables: [...prevState.collectables, ...response.data],
  //           nextPage: response.links.next ? response.links.next : ''
  //         };
  //       });
  //     });
  // };


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
          console.error(error);
          this.setState({
            loading: false
          })
        }
      )
      .then(response => {
        console.log(`Fetch returned:`);
        console.log(response);
        // Display the pins
        if (response.data[0] && response.data[0].searchable_type) {
          let allPromises = response.data.map(searchable => {
            return fetch(searchable.url)
              .then(
                results => {
                  return results.json();
                },
                error => {
                  console.error(error);
                }
              )
              .then(innerResponse => {
                // Display the searchable
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
              loading: false
            });
          });
        } else {
          this.setState({
            loading: false,
            collectables: response.data,
            nextPage: response.links.next ? response.links.next : ''
          });
        }
      });
  };


  _loadMore = async () => {
    if (this.state.nextPage === '' || this.state.nextPage === null || this.state.nextPage === undefined) {
      return this.setState({
        loadingMore: false,
      });
    }
    this.setState({
      loadingMore: true,
    });
    fetch(this.state.nextPage)
      .then(
        results => {
          return results.json();
        },
        error => {
          console.error(error);
          this.setState({
            loadingMore: false
          })
        }
      )
      .then(response => {
        console.log(`Fetch More returned:`);
        console.log(response);
        // Display the pins
        if (response.data[0] && response.data[0].searchable_type) {
          let allPromises = response.data.map(searchable => {
            return fetch(searchable.url)
              .then(
                results => {
                  return results.json();
                },
                error => {
                  console.error(error);
                }
              )
              .then(innerResponse => {
                // Display the searchable
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
        } else {
          this.setState(prevState => {
            return {
              loadingMore: false,
              collectables: [...prevState.collectables, ...response.data],
              nextPage: response.links.next ? response.links.next : ''
            }
          });
        }
      });
  };


  _renderItem = ({item}) => (
    <CollectableItem collectableData={item} />
  );

  _keyExtractor = (item, index) => item.id;

  _handleRefresh = () => {
    this.setState(
      {
        nextPage: '',
        refreshing: true
      },
      () => {
        this._executeQuery();
      }
    );
  };

  _renderFooter = () => {
    if (!this.state.loadingMore) return null;

    return (
      <View
        style={{
          position: 'relative',
          width: width,
          height: height,
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          borderColor: 'red'
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          this.state.collectables.length !== 0 ? (
            <ScrollView style={styles.container}>
              <FlatList
                numColumns={3}
                contentContainerStyle={styles.contentContainer}
                columnWrapperStyle={styles.row}
                data={this.state.collectables}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                onRefresh={this._handleRefresh}
                refreshing={this.state.refreshing}
                ListFooterComponent={this._renderFooter}
              />
              <LoadMoreButton nextPage={this.state.nextPage} fetchMoreItems={this._loadMore} />
            </ScrollView>
          ) : (
            <Text>Your search query returned no results. Try something else.</Text>
          )
        )}
      </View>
    );
  }
}

Collectables.propTypes = {
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
    paddingTop: 30,
    flex: 1,
    justifyContent: 'space-around'
  },
  activityIndicator: {
    marginTop: 200,
  }
});

export default Collectables;
