import React, {Component} from 'react';
import {View} from 'react-native';

class ListItem extends Component {

  render() {
    return <View style={this.props.customStyle}>{this.props.children}</View>;
  }
}

export default ListItem;
