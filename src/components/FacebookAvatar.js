import React from 'react';
import PropTypes from "prop-types";
import {Avatar} from "react-native-paper";

class FacebookAvatar extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url,
      size: this.props.size,
    };
  }

  render() {
    return (
      <Avatar.Image source={{uri: this.state.url}} size={this.state.size} />
    );
  }
}

FacebookAvatar.propTypes = {
  url: PropTypes.any.isRequired,
  size: PropTypes.number
};

export default FacebookAvatar;
