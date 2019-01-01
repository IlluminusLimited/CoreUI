import React from 'react';
import {BottomNavigation, Text} from "react-native-paper";
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Profile = () => <Text>poo</Text>;

export default class MainTabNavigator extends React.Component {
  state = {
    index: 2,
    routes: [
      {key: 'settings', title: 'Settings', icon: 'settings', color: '#b0af00'},
      {key: 'home', title: 'Home', icon: 'home', color: '#6d3293'},
      {key: 'collections', title: 'Collections', icon: 'collections', color: '#0ca26d'},
      {key: 'profile', title:'Profile', icon: "person", color: '#ff9187'}
    ],
  };

  _handleIndexChange = index => this.setState({index});

  _renderScene = BottomNavigation.SceneMap({
    settings: SettingsScreen,
    home: HomeScreen,
    collections: LinksScreen,
    profile: Profile
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}