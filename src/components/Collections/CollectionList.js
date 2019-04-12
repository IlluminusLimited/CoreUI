import React, {Component} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import PropTypes from "prop-types";
import {Text} from "react-native-paper";

export class CollectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collections: this.props.collectionsData
    }
  };

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {Object.keys(this.state.collections).map(key => (
          <Text>temp</Text>
        ))}

      </ScrollView>
    );
  }
}

CollectionList.propTypes = {
  collectionsData: PropTypes.array.isRequired,
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

export default CollectionList;
