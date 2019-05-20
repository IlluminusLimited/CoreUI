import React from 'react';
import PropTypes from "prop-types";
import {Avatar} from "react-native-paper";

class SmartAvatar extends React.PureComponent {
  _convertNameToInitials = () => {
    if (this.props.userName) {
      return this.props.userName.split(" ").map((n) => n[0]).join("");
    }
    return ''
  };

  render() {
    if (this.props.url) {
      return <Avatar.Image source={{uri: this.props.url}} size={this.props.size} />
    }
    return <Avatar.Text label={this._convertNameToInitials()} size={this.props.size} />
  }
}

SmartAvatar.propTypes = {
  url: PropTypes.any,
  userName: PropTypes.string,
  size: PropTypes.number
};

export default SmartAvatar;
