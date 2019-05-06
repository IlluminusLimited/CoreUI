import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {FAB} from "react-native-paper";
import CollectionList from "../components/Collections/CollectionList";
import ENV from "../utilities/environment.js"
import ApiClient from "../utilities/ApiClient"
import Colors from "../constants/Colors";

export default class Collections extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: 'My Collections'
    };
  };
  DEFAULT_URL = `${ENV.API_URI}/users/:user_id/collections?page%5Bsize%5D=${ENV.PAGE_SIZE}`;

  state = {
    query: '',
    pageLink: this.DEFAULT_URL,
  };

  componentDidMount() {
    this._fetchCollections();
  }

  _fetchCollections() {
    new ApiClient().get(this.state.pageLink,
      (error) => {
        console.log("Auth failure was called with", error);
        this.props.navigation.navigate("Auth");
      })
      .then(collections => {
        console.log("CollectionList:", collections);
        this.setState({
          collections: collections.data,
        })
      })
      .catch(error => console.error('error getting collections', error));
  }


  _navigateToNewCollection() {
    this.props.navigation.navigate('NewCollection')
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <CollectionList pageLink={this.state.pageLink} />
        <FAB
          style={styles.fab}
          icon="add"
          onPress={() => this._navigateToNewCollection()}
        />
      </SafeAreaView>
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
    backgroundColor: Colors.turquoise,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    marginHorizontal: 20,
  }
});
