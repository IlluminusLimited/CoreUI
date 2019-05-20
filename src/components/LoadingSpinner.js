import {StyleSheet} from "react-native";
import Colors from "../constants/Colors";

import React, {Component} from 'react';
import {ActivityIndicator} from "react-native-paper";
import PropTypes from "prop-types";

class LoadingSpinner extends Component {
  render() {
    return (
      <ActivityIndicator
        color={this.props.color ? this.props.color : Colors.turquoise}
        style={styles.activityIndicator} />
    )
  }
}


LoadingSpinner.propTypes = {
  color: PropTypes.string,
};


const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoadingSpinner;