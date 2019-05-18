import React, {Component} from 'react';
import {Image, StyleSheet, View} from "react-native";
import PropTypes from "prop-types";


const fuckingImages = {
  2019: require(`../../assets/images/gf_logos/2019.png`),
  2018: require(`../../assets/images/gf_logos/2018.png`),
};


class GfLogo extends Component {

  _requireImage = (year) => {
    if (year) {
      return fuckingImages[year]
    }
    return '../../assets/images/BrokenImage_200x200.png';
  };

  render() {
    return (
      <View style={styles.logoContainer}>
        <Image style={styles.logo}
               source={this._requireImage(this.props.year)}
               resizeMode={'contain'}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
  },
  logo: {
    flex: 1,
    height: undefined,
    width: undefined
  }
});

GfLogo.propTypes = {
  year: PropTypes.any.isRequired
};

export default GfLogo