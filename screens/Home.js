import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Collectables} from "../components/Collectables";
import TabBarIcon from "../components/TabBarIcon";

export default class Home extends Component {
  static navigationOptions = {
    tabBarIcon: <TabBarIcon name={'md-home'}/>
  };
  state = {
    loaded: false,
    collectables: []
  };

  componentDidMount() {
    this._fetchPins();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          {this.state.loaded ? (
            this.state.collectables.length !== 0 ? (
              <Collectables collectableData={this.state.collectables} />
            ) : (
              <Text>Your search query returned no results. Try something else.</Text>
            )
          ) : (
            <Text>Fuckasdf you</Text>
          )}
        </ScrollView>
      </View>
    );
  }

  _fetchPins() {
    fetch('https://api-dev.pinster.io/v1/pins?page%5Bsize%5D=15')
      .then(results => results.json())
      .then(collectables => {
        console.log(collectables);
        this.setState({
          collectables: collectables.data,
          loaded: true
        })
      })
      .catch(error => console.error('error getting all pins', error));
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
