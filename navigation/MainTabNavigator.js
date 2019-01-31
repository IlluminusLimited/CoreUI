import React from 'react';
import {BottomNavigation, Text} from 'react-native-paper';
import Home from '../components/Home';
import Collections from '../components/Collections';
import Settings from '../components/Settings';
const Profile = () => <Text>poo</Text>;

class MainTabNavigator extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    index: 0,
    routes: [
      {key: 'home', title: 'Home', icon: 'home', color: '#6d3293'},
      {
        key: 'collections',
        title: 'Collections',
        icon: 'collections',
        color: '#0ca26d'
      },
      {key: 'profile', title: 'Profile', icon: 'person', color: '#ff9187'},
      {key: 'settings', title: 'Settings', icon: 'settings', color: '#b0af00'}
    ]
  };

  _handleIndexChange = index => this.setState({index});

  _renderScene = BottomNavigation.SceneMap({
    settings: Settings,
    home: Home,
    collections: Collections,
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
export default MainTabNavigator;