import React, {Component} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import CollectableItem from "./CollectableItem";
import PropTypes from "prop-types";

export class Collectables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectables: this.props.collectableData
    }
  };

  render() {
    return (
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
