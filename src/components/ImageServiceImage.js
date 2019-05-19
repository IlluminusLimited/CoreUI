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

          // <Image style={{height: 78, width: undefined}}
          //        source={require('../../assets/images/PendingImage_200x200.png')} />
          )
        }
      </React.Fragment>

    );
  }
}

ImageServiceImage.propTypes = {
  imageData: PropTypes.object,
  dimensions: PropTypes.string.isRequired,
  // placeholder: PropTypes.number.isRequired
};

export default ImageServiceImage;


//
// import React from 'react';
// import PropTypes from "prop-types";
// // import {Image} from "react-native-expo-image-cache";
// import {TouchableOpacity, View} from "react-native";
// import {Image, Surface, Text} from "react-native-paper";
// import FeaturedImageList from "../utilities/FeaturedImageList";
//
// class ImageServiceImage extends React.PureComponent {
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       imageData: this.props.imageData,
//       dimensions: this.props.dimensions,
//     };
//   }
//
//   _usePlaceholder = () => {
//     return !this.state.imageData
//   }
//
//   _buildUri = (dimensions) => {
//     if (!this.state.imageData) {
//       // return this.props.placeholder
//     }
//     else if (this.state.imageData.thumbnailable) {
//       return this.state.imageData.storage_location_uri + '_' + dimensions;
//     }
//     else
//       return this.state.imageData.storage_location_uri;
//   };
//
//   render() {
//     return (
//       <React.Fragment>
//         {!this.state.imageData ? (
//           <Image tint={'light'} style={{height: '200', width: '200'}} source={this.props.placeholder} />
//         ) : (
//           <Image tint={'light'} style={this.props.style} source={{uri: this._buildUri('dimensions')}}
//                  source={{uri: this._buildUri(this.state.dimensions)}} />
//         )
//         }
//       </React.Fragment>
//     )
//   }
//
// }
//
// ImageServiceImage.propTypes = {
//   imageData: PropTypes.object,
//   dimensions: PropTypes.string.isRequired,
//   placeholder: PropTypes.number.isRequired
// };
//
// export default ImageServiceImage;
