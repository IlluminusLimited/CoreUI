import React, {Component} from 'react';
import {Dimensions, FlatList, SectionList, StyleSheet, View} from 'react-native';
import CollectableItem from "./CollectableItem";
import PropTypes from "prop-types";
import LoadMoreButton from "../LoadMoreButton";
import {Paragraph, Title} from "react-native-paper";
import CurrentUserProvider from "../../utilities/CurrentUserProvider";
import {withNavigation} from "react-navigation";
import LoadingSpinner from "../LoadingSpinner";
import {Mutex} from "async-mutex";

Array.prototype.contains = function (v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function () {
  let arr = [];
  for (let i = 0; i < this.length; i++) {
    if (!arr.includes(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
};

const mutex = new Mutex();

export class CollectableList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      apiClient: null,
      collectables: [],
      pageLink: this.props.pageLink,
      nextPage: '',
      loading: true,
      loadingMore: false,
      refreshing: false,
      columns: 3,
      noResultsText: this.props.noResultsText ? this.props.noResultsText : "Your search query returned no results. Try something else."
    };
    this.loadedPages = new Set();
  };

  componentWillMount() {
    this._calculateNumberOfColumns();
  }

  componentWillUnmount() {
    if (this.props.alwaysReload) {
      this.focusListener.remove();
    }
    console.info("Resetting state for loaded pages.");
    this.loadedPages.clear();
  }

  componentDidMount() {
    const {navigation} = this.props;
    if (this.props.alwaysReload) {
      console.log("Always reload is a thing");
      this.focusListener = navigation.addListener("didFocus", () => {
        console.log("Listener");

        if (this.props.currentUser) {
          const client = this.props.currentUser.getApiClient();
          return this.setState({
            currentUser: this.props.currentUser,
            apiClient: client,
          }, () => {
            return this._executeQuery();
          });
        }

        CurrentUserProvider.getApiClient().then(client => {
          this.setState({
            apiClient: client,
          })
        }).then(() => {
          return this._executeQuery();
        })
      });
    }
    if (this.props.currentUser) {
      const client = this.props.currentUser.getApiClient();
      return this.setState({
        currentUser: this.props.currentUser,
        apiClient: client,
      }, () => {
        return this._executeQuery();
      });
    }

    CurrentUserProvider.getApiClient().then(client => {
      this.setState({
        apiClient: client,
      })
    }).then(() => {
      return this._executeQuery();
    })
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
      collectables: [],
    }, () => {
      this.state.apiClient.get(this.state.pageLink)
        .then(json => {
          // console.log(`Fetch returned:`, json);
          // Display the pins
          if (json.data[0] && json.data[0].searchable_type) {
            json.data.map(searchableResult => {
              return this.setState(prevState => {
                return {
                  collectables: [...prevState.collectables, searchableResult.searchable],
                  nextPage: json.links.next ? json.links.next : ''
                };
              });
            });

            return this.setState({
              loading: false,
              refreshing: false,
            });
          } else if (json.data[0] && json.data[0].collectable_type) {
            json.data.map(collectableResult => {
              return this.setState(prevState => {
                return {
                  collectables: [...prevState.collectables, collectableResult.collectable],
                  nextPage: json.links.next ? json.links.next : ''
                };
              });
            });

            return this.setState({
              loading: false,
              refreshing: false,
            });
          } else {
            this.setState({
              loading: false,
              refreshing: false,
              collectables: json.data,
              nextPage: json.links.next ? json.links.next : ''
            });
          }
        }).catch(error => {
        //TODO Show error dialog
        console.error("There was a really bad error while getting collectables.", error);
      });
    })
  };

  _executeLoadMore = async () => {
    const urlLoaded = await mutex.runExclusive(() => {
      // console.debug("Contents of loadedPages", this.loadedPages);
      if (this.loadedPages.has(this.state.nextPage)) {
        return true;
      }
      console.debug("Adding link to set", this.state.nextPage);
      this.loadedPages.add(this.state.nextPage);
      return false;
    });

    if (urlLoaded) {
      console.warn("Url already loaded!", this.state.nextPage);
      return;
    }

    // console.debug("executeLoadMore");
    this.state.apiClient.get(this.state.nextPage)
      .then(json => {
        // console.log(`Fetch More returned:`, response);
        // Display the pins
        if (json.data[0] && json.data[0].searchable_type) {
          json.data.map(searchableResult => {
            return this.setState(prevState => {
              return {
                collectables: [...prevState.collectables, searchableResult.searchable],
                nextPage: json.links.next ? json.links.next : ''
              };
            });
          });

          return this.setState({
            loadingMore: false,
          });
        } else if (json.data[0] && json.data[0].collectable_type) {
          json.data.map(collectableResult => {
            return this.setState(prevState => {
              return {
                collectables: [...prevState.collectables, collectableResult.collectable],
                nextPage: json.links.next ? json.links.next : ''
              };
            });
          });

          return this.setState({
            loadingMore: false,
          });
        } else {
          this.setState(prevState => {
            return {
              loadingMore: false,
              collectables: [...prevState.collectables, ...json.data],
              nextPage: json.links.next ? json.links.next : ''
            }
          });
        }
      }).catch(error => {
      this.loadedPages.delete(this.state.nextPage);
      this.setState({
        loadingMore: false,
        loading: false
      });
      //TODO pop error dialog
      console.error("There was a really bad error while loading more collectables.", error)
    });
  };


  _loadMore = async () => {
    if (this.state.nextPage === '' || this.state.nextPage === null || this.state.nextPage === undefined) {
      // console.debug("Not loading more. list size: ", this.state.collectables.length);
      return this.setState({
        loadingMore: false,
      });
    }
    // console.debug("Loading more");
    return this.setState({
        loadingMore: true
      }, () => {
        return this._executeLoadMore()
      }
    )
  };

  //Make sure to match what CollectableItem has in  its style!
  _getItemLayout = (data, index) => ({
    length: 110,
    offset: 145 * index,
    index
  });


  _splitItems = () => {
    const collectables = this.state.collectables;
    const years = collectables.map((collectable) => {
      return collectable.year
    }).unique();

    // console.log("years", years);

    const blankSections = years.map((year) => {
      if (year === null || year === '' || year === undefined) {
        return {title: 'Unknown', data: [[]]}
      }
      return {title: year, data: [[]]}
    });

    // console.log("Blank sections", blankSections);

    const sectionedCollectables = collectables.reduce((memo, collectable) => {
      const year = (collectable.year === null || collectable.year === '' || collectable.year === undefined) ? 'Unknown' : collectable.year;
      const section = memo.find((section) => section.title === year);
      // console.log("Section", section);
      section.data[0].push(collectable);
      return memo;
    }, blankSections);

    // console.log("sectioned collectables[1]", sectionedCollectables[1]);

    const sortedSections = sectionedCollectables.sort((a, b) => {
      if (a.title === b.title) {
        return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
      }

      return a.title > b.title ? 1 : -1;
    }).reverse();
    // console.log("sorted sections", sortedSections.map((section) => section.title));
    return sortedSections;
  };

  _buildCollectables = (collectables) => {
    const extraCells = collectables.length % this.state.columns;
    if (extraCells === 0) {
      return collectables;
    }
    const paddingCells = this.state.columns - extraCells;
    // console.log("padding cells to make", paddingCells);
    const padding = [];
    for (let i = 0; i < paddingCells; i++) {
      padding.push({isPadding: true});
    }
    return [...collectables, ...padding]
  };

  _renderFlatList = ({item, index, section}) => (
    <FlatList
      numColumns={this.state.columns}
      contentContainerStyle={styles.contentContainer}
      columnWrapperStyle={styles.row}
      data={this._buildCollectables(item)}
      keyExtractor={this._keyExtractor}
      renderItem={this._renderItem}
      getItemLayout={this._getItemLayout} //Simplify the calculations for the rendered components.
      removeClippedSubviews={true} //Unmount components that are offscreen
      highermaxToRenderPerBatch={3} //Render 3 items instead of 1 at a time
    />
  );

  _renderItem = ({item, index, section}) => (
    <CollectableItem collectable={item} />
  );

  _renderSectionHeader = ({section: {title}}) => (
    <View style={this.props.sectionHeaderStyle}>
      <Title style={styles.sectionHeaderTitle}>{title}</Title>
    </View>
  );

  _keyExtractorSectionList = (_item, index) => index;

  _keyExtractor = (item) => item.id;

  _handleRefresh = () => {
    this.setState(
      {
        nextPage: '',
        refreshing: true
      },
      () => {
        console.info("Resetting state for loaded pages.");
        mutex.runExclusive(() => {
          this.loadedPages.clear();
        }).then(() => {
          CurrentUserProvider.getApiClient()
            .then(client => {
              this.setState({
                  apiClient: client,
                  collectables: [],
                },
                this._executeQuery
              )
            })
        })
      }
    );
  };

  _renderFooter = () => {
    return (
      <LoadMoreButton style={styles.loadMore}
                      nextPage={this.state.nextPage}
                      fetchMoreItems={this._loadMore}
                      loading={this.state.loadingMore} />
    );
  };


  _emptyListComponent = () => {
    //TODO: Show example of favorite button
    return (<Paragraph style={styles.noResults}>{this.state.noResultsText}</Paragraph>
    );
  };

  _loadingSpinner = () => {
    if (this.props.loadingSpinner) {
      return this.props.loadingSpinner
    }

    return (<LoadingSpinner />)
  };

  render() {
    return (
      <View style={this.props.style}>
        {this.state.loading ? (
          this._loadingSpinner()
        ) : (
          <SectionList
            stickySectionHeadersEnabled={true}
            sections={this._splitItems()}
            keyExtractor={this._keyExtractorSectionList}
            renderItem={this._renderFlatList}
            renderSectionHeader={this._renderSectionHeader}
            onRefresh={this._handleRefresh}
            onEndReachedThreshold={0.01}
            onEndReached={this._loadMore}
            refreshing={this.state.refreshing}
            ListFooterComponent={this._renderFooter}
            ListEmptyComponent={this._emptyListComponent}
            removeClippedSubviews={true}
          />
        )}
      </View>
    );
  }
}

CollectableList.propTypes = {
  currentUser: PropTypes.object,
  noResultsText: PropTypes.string,
  style: PropTypes.object,
  alwaysReload: PropTypes.bool,
  pageLink: PropTypes.string.isRequired,
  loadingSpinner: PropTypes.element,
  sectionHeaderStyle: PropTypes.object.isRequired,

};

const styles = StyleSheet.create({
  noResults: {
    paddingHorizontal: 5,
  },
  contentContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  row: {
    paddingTop: 5,
    flex: 1,
    justifyContent: 'space-around'
  },
  loadMore: {
    flex: 1,
    marginTop: 50,
    marginBottom: 20,
    marginHorizontal: 10
  },
  sectionHeaderTitle: {
    fontWeight: 'bold',
    color: '#fff'
  }
});

export default withNavigation(CollectableList);
