import React from 'react';
import {ActivityIndicator, AsyncStorage, ScrollView, StyleSheet, View} from 'react-native';
import {FAB, Text} from "react-native-paper";

export default class Collections extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: 'My Collections'
    };
  };

  state = {
    loaded: false,
    userId: this.props.userId,
    collections: []
  };

  constructor(props) {
    super(props);
    this._loadUserId();
  }

  componentDidMount() {
    this._fetchCollections();
  }

  _fetchCollections() {
    fetch(`https://api-dev.pinster.io/v1/users/${this.state.userId}/collections?page%5Bsize%5D=15`)
      .then(results => results.json())
      .then(collections => {
        console.log(collections);
        this.setState({
          collections: collections.data,
          loaded: true
        })
      })
      .catch(error => console.error('error getting collections', error));
  }

  // Fetch the userId from storage
  //maybe a "userProvider" might work?
  _loadUserId = async () => {
    AsyncStorage.getItem('userId')
      .then(userId => this.setState({userId: userId}))
      .catch(error => console.error("Error loading userId", error));
  };


  _navigateToNewCollection() {
    this.props.navigation.navigate('NewCollection')
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
        >
          {this.state.loaded ? (
            this.state.collections.length !== 0 ? (
              <Collections collectionsData={this.state.collections} />
            ) : (
              <Text>It doesn't look like there's anything here. You should make a collection.</Text>
            )
          ) : (
            <ActivityIndicator />
          )}
        </ScrollView>
        <FAB
          style={styles.fab}
          small
          icon="add"
          onPress={() => this._navigateToNewCollection()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingTop: 10
  },
  fab: {
    backgroundColor: '#ff9187',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
