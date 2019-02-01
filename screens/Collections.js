import React from 'react';
import {ActivityIndicator, AsyncStorage, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from "react-native-paper";
import {Ionicons} from "react-native-vector-icons";
import {Collectables} from "../components/Collectables";
import PropTypes from "prop-types";

export default class Collections extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null
    };
  };

  constructor(props) {
    super(props);
    this._loadUserId();
  }

  state = {
    loaded: false,
    userId: this.props.userId,
    collections: []
  };

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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
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
});
