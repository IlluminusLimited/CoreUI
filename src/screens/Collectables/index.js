import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import CollectableItem from "../../components/Collectables/CollectableItem";
import PropTypes from "prop-types";
import {Searchbar} from "react-native-paper";

export class Collectables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectables: this.props.collectableData,
      query: ''
    }
  };

  render() {
    return (
      <View>
        <Searchbar
          placeholder="Search"
          onChangeText={query => {
            this.setState({query: query});
          }}
          value={this.state.query}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          {Object.keys(this.state.collectables).map(key => (
            <CollectableItem
              key={key}
              uid={key}
              collectableData={this.state.collectables[key]}
            />
          ))}

        </ScrollView>
      </View>
    );
  }
}

Collectables.propTypes = {
  collectableData: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
});

export default Collectables;
