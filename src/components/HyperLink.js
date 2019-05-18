import React, {Component} from 'react';
import {Linking} from 'react-native';
import {Button} from "react-native-paper";
import PropTypes from "prop-types";
import Colors from "../constants/Colors";

export default class HyperLink extends Component {
  _handleOpenWithLinking = () => {
    Linking.openURL(this.props.url);
  };

  render() {
    return (
      <Button
        onPress={this._handleOpenWithLinking}
        mode={'contained'}
        color={Colors.turquoise}
        style={this.props.style}>{this.props.title}</Button>
    );
  }
}

HyperLink.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
