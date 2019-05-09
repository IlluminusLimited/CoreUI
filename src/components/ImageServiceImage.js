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
    if (this.state.imageData.thumbnailable) {
      return {uri: this.state.imageData.storage_location_uri + '_' + this.state.dimensions };
    } else if (this.props.placeholder){
      return this.props.placeholder
    }
    return {uri: this.state.imageData.storage_location_uri};
  };

  render() {
    return (
      <Image style={this.props.style} source={ this._buildUri()} />
    );
  }
}

ImageServiceImage.propTypes = {
  imageData: PropTypes.object.isRequired,
  dimensions: PropTypes.string.isRequired
};

export default ImageServiceImage;
