import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class CustomText extends Component {
  setFontType = type => {
    switch (type) {
      case 'bold':
        return 'OpenSans-Bold';
      case 'boldItalic':
        return 'OpenSans-BoldItalic';
      case 'extraBold':
        return 'OpenSans-ExtraBold';
      case 'extraBoldItalic':
        return 'OpenSans-ExtraBoldItalic';
      case 'italic':
        return 'OpenSans-Italic';
      case 'light':
        return 'OpenSans-Light';
      case 'lightItalic':
        return 'OpenSans-LightItalic';
      case 'semiBold':
        return 'OpenSans-SemiBold';
      case 'semiBoldItalic':
        return 'OpenSans-SemiBoldItalic';
      default:
        return 'OpenSans-Regular';
    }
  };

  render() {
    const font = this.setFontType(this.props.type ? this.props.type : 'normal');
    const style = [{ fontFamily: font }, this.props.style || {}];
    const allProps = Object.assign({}, this.props, { style: style });
    return <Text {...allProps}>{this.props.children}</Text>;
  }
}
export default CustomText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});