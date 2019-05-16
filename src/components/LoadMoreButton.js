import React from 'react';
import {View} from "react-native";
import {Button} from "react-native-paper";
import PropTypes from "prop-types";

//TODO: Make this go through a loading state and stuff after its clicked
export default class LoadMoreButton extends React.PureComponent {
  render() {
    return (
      <View>
        {(this.props.nextPage === '' || this.props.nextPage === null || this.props.nextPage === undefined) ?
          (
            null
          ) : (
            <View style={this.props.style}>
              <Button mode={'contained'} dark={true} onPress={this.props.fetchMoreItems}>
                Load more
              </Button>
            </View>
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