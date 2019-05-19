import React from 'react';
import {Image} from 'react-native';
import PropTypes from "prop-types";
import {Image as ProgressiveImage} from 'react-native-expo-image-cache';

class ImageServiceImage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      imageData: this.props.imageData,
      dimensions: this.props.dimensions,
    };
  }

  _buildUri = (dimensions) => {
    if (this.state.imageData.thumbnailable) {
      return this.state.imageData.storage_location_uri + '_' + dimensions;
    }
    else
      return this.state.imageData.storage_location_uri;
  };

  render() {
    return (
      <React.Fragment>
        {this.state.imageData ? (
          <ProgressiveImage
            resizeMode={'contain'}
            style={this.props.style}
            tint={'light'}
            preview={{uri: this._buildUri('50x50')}}
            uri={this._buildUri(this.props.dimensions)} />
          ) : (

          <Image source={require('../../assets/images/PendingImage100x100.png')} />
          )
        }
      </React.Fragment>

    );
  }
}

ImageServiceImage.propTypes = {
  imageData: PropTypes.object,
  dimensions: PropTypes.string.isRequired,
};

export default ImageServiceImage;