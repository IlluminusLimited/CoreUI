import React from 'react';
import {Image} from 'react-native';
import PropTypes from "prop-types";

class ImageServiceImage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      imageData: this.props.imageData,
      dimensions: this.props.dimensions,
    };
  }

  _buildUri = () => {
    if (!this.state.imageData) {
      return this.props.placeholder
    }
    else if (this.state.imageData.thumbnailable) {
      return {uri: this.state.imageData.storage_location_uri + '_' + this.state.dimensions};
    }
    else
      return {uri: this.state.imageData.storage_location_uri};
  };

  render() {
    return (
      <Image style={this.props.style} source={this._buildUri()} />
    );
  }
}

ImageServiceImage.propTypes = {
  imageData: PropTypes.object,
  dimensions: PropTypes.string.isRequired,
  placeholder: PropTypes.number.isRequired
};

export default ImageServiceImage;
