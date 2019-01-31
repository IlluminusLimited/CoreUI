import React from "react";
import {View} from "react-native";
import {IconButton, Text} from "react-native-paper";

export default class TabBarIconWithBadge extends React.Component {
  render() {
    const {icon, badgeCount, color, size} = this.props;
    return (
      <View style={{width: 26, height: 26, margin: -10, right: 10}}>
        <IconButton icon={icon} size={size} color={color} />
        {badgeCount > 0 && (
          <View style={{
            // If you're using react-native < 0.57 overflow outside of the parent
            // will not work on Android, see https://git.io/fhLJ8
            position: 'absolute',
            right: -13,
            top: 8,
            backgroundColor: 'red',
            borderRadius: 8,
            width: 13,
            height: 13,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>{badgeCount}</Text>
          </View>
        )}
      </View>
    );
  }
}
