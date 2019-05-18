import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {FAB} from "react-native-paper";
import CollectionList from "../components/Collections/CollectionList";
import ENV from "../utilities/Environment.js"
import Colors from "../constants/Colors";

export default class Collections extends React.Component {
  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      title: 'My Collections',
      headerStyle: {
        backgroundColor: Colors.salmon
      },
      headerTitleStyle: {
        color: '#fff'
      }
    };
  };

  DEFAULT_URL = `${ENV.API_URI}/v1/users/:user_id/collections?page%5Bsize%5D=${ENV.PAGE_SIZE}`;

  state = {
    query: '',
    shouldRefresh: false,
    pageLink: this.DEFAULT_URL,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.refresh) {
      console.log("Got refresh props!");
      this.setState({
        shouldRefresh: true
      })
    }
  }

  _navigateToNewCollection() {
    this.props.navigation.navigate('NewCollection')
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <CollectionList pageLink={this.state.pageLink} shouldRefresh={this.state.shouldRefresh} />
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
