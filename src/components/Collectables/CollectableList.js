import React, {Component} from 'react';
import {Dimensions, SectionList, StyleSheet, Text, View} from 'react-native';
import CollectableItem from "./CollectableItem";
import PropTypes from "prop-types";
import LoadMoreButton from "../LoadMoreButton";
import {ActivityIndicator, Title} from "react-native-paper";
import CurrentUserProvider from "../../utilities/CurrentUserProvider";
import {withNavigation} from "react-navigation";
import Colors from "../../constants/Colors";

Array.prototype.contains = function(v) {
  for(var i = 0; i < this.length; i++) {
    if(this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function() {
  var arr = [];
  for(var i = 0; i < this.length; i++) {
    if(!arr.includes(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
}

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
    }
  };

  componentWillMount() {
    this._calculateNumberOfColumns();
  }

  componentWillUnmount() {
    if (this.props.alwaysReload) {
      this.focusListener.remove();
    }
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
          console.log(`Fetch returned:`, json);
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
          }
          else if (json.data[0] && json.data[0].collectable_type) {
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
          }
          else {
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

          this.setState({
            loadingMore: false,
          });
        }
        if (json.data[0] && json.data[0].collectable_type) {
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
        }
        else {
          this.setState(prevState => {
            return {
              loadingMore: false,
              collectables: [...prevState.collectables, ...json.data],
              nextPage: json.links.next ? json.links.next : ''
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

  _buildCollectables = () => {
    const extraCells = this.state.collectables.length % this.state.columns;
    if (extraCells === 0) {
      return this.state.collectables;
    }
    const paddingCells = this.state.columns - extraCells;
    console.log("padding cells to make", paddingCells);
    const padding = [];
    for (let i = 0; i < paddingCells; i++) {
      padding.push({isPadding: true});
    }
    return [...this.state.collectables, ...padding]
  };

  _splitItems = () =>{
    const collectables = this._buildCollectables();
    const years = collectables.map((collectable) =>{
      return collectable.year
    }).unique();

    const blankSections = years.map((year) =>{
      return {title: 'year', data: []}
    });

    const sectionedCollectables = collectables.reduce((memo, collectable) => {
      const section = memo.filter((section) => section.title === collectable.year)[0];


    }, blankSections)
  };

  _renderItem = ({item, index, section}) => (
    <CollectableItem key={index} collectable={item} />
  );

  _renderSectionHeader = ({section: {title}}) => (
    <View style={styles.sectionHeader}>
      <Title style={styles.sectionHeaderTitle}>{title}</Title>
    </View>
  );



  _keyExtractor = (item) => item.id;

  _handleRefresh = () => {
    this.setState(
      {
        nextPage: '',
        refreshing: true
      },
      () => {
        CurrentUserProvider.getApiClient()
          .then(client => {
            this.setState({
                apiClient: client,
                collectables: [],
              },
              this._executeQuery
            )
          })
      }
    );
  };

  _renderFooter = () => {
    return (
      <LoadMoreButton style={styles.loadMore} nextPage={this.state.nextPage} fetchMoreItems={this._loadMore} />
    );
  };



  _emptyListComponent = () => {
    //TODO: Show example of favorite button
    return (<Text style={styles.noResults}>{this.state.noResultsText}</Text>
    );
  };

  render() {
    return (
      <View style={this.props.style}>
        {this.state.loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          <SectionList
            numColumns={this.state.columns}
            contentContainerStyle={styles.contentContainer}
            columnWrapperStyle={styles.row}
            data={this._buildCollectables()}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            onRefresh={this._handleRefresh}
            refreshing={this.state.refreshing}
            ListFooterComponent={this._renderFooter}
            ListEmptyComponent={this._emptyListComponent}
          />
        )}
      </View>
    );
  }
}

CollectableList.propTypes = {
  currentUser: PropTypes.object,
  pageLink: PropTypes.string.isRequired,
  noResultsText: PropTypes.string,
  style: PropTypes.object,
  alwaysReload: PropTypes.bool
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMore: {
    flex: 1,
    marginTop: 50,
    marginBottom: 20,
    marginHorizontal: 10
  },
  sectionHeader: {
    height: 50,
    backgroundColor: Colors.turquoise
  },
  sectionHeaderTitle: {
    fontWeight: 'bold'
  }
});

export default withNavigation(CollectableList);
