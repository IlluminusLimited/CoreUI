import React from 'react';
import {View} from "react-native";
import {IconButton} from "react-native-paper";

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <View style={{width: 26, height: 26, margin: -10, right: 10}}>
        <IconButton icon={this.props.icon} size={this.props.size} color={this.props.color} />
      </View>
    )
  }
}