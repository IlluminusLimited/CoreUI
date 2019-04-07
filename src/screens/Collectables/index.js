import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import CollectableItem from "../../components/Collectables/CollectableItem";
import PropTypes from "prop-types";

export class Collectables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collectables: this.props.collectableData,
    }
  };

  _renderItem = ({item}) => (
    <CollectableItem collectableData={item} />
  );

  _keyExtractor = (item, index) => item.id;


  render() {
    return (
      <View style={styles.container}>
        <FlatList
          numColumns={3}
          contentContainerStyle={styles.contentContainer}
          columnWrapperStyle={styles.row}
          data={this.state.collectables}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
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
    flexDirection: 'column',
  },
  row: {
    paddingTop: 30,
    flex: 1,
    justifyContent: 'space-around'
  }
});

export default Collectables;
