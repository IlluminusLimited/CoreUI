import React from 'react';
import {BottomNavigation, Text} from "react-native-paper";
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Profile = () => <Text>poo</Text>;

export default class MainTabNavigator extends React.Component {
  state = {
    index: 1,
    routes: [
      {key: 'settings', title: 'Settings', icon: 'settings', color: '#ff2c2a'},
      {key: 'home', title: 'Home', icon: 'home', color: '#2aee8d'},
      {key: 'collections', title: 'Collections', icon: 'collections', color: '#ff39fe'},
      {key: 'profile', title:'Profile', icon: "person", color: '#24ff3c'}
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