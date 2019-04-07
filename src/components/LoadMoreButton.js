import React from 'react';
import {View} from "react-native";
import {Button} from "react-native-paper";
import PropTypes from "prop-types";

export default class LoadMoreButton extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        {(this.props.nextPage === '' || this.props.nextPage === null || this.props.nextPage === undefined) ?
          (
            null
          ) : (
            <Button style={{mode: 'contained', dark: true}} onPress={this.props.fetchMoreItems}>
              Load more
            </Button>
          )}
      </View>
    )
  }
}

LoadMoreButton.propTypes = {
  nextPage: PropTypes.string,
  style: PropTypes.object,
  fetchMoreItems: PropTypes.func.isRequired,
};