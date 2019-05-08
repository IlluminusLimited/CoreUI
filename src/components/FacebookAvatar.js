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

  _buildUri = () => {
    console.log(this.state.url)
    const string =  this.state.url.replace("height=50", "height=" + this.state.size)
      .replace("width=50", "width=" + this.state.size)
    console.log("String", string)
    return string
  };

  render() {
    return (
      <Avatar.Image source={{uri: this._buildUri()}} size={this.state.size} />
    );
  }
}

FacebookAvatar.propTypes = {
  url: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
};

export default FacebookAvatar;
