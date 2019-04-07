import React from 'react';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import {createStackNavigator} from "react-navigation";
import Home from "../screens/Home";
import Collections from "../screens/Collections";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import TabBarIcon from "../components/TabBarIcon";
import Collectable from "../screens/Collectables/Collectable";
import {Collectables} from "../screens/Collectables";
import CollectableItem from "../components/Collectables/CollectableItem";
import Collection from "../components/Collections/Collection";
import NewCollection from "../screens/Collections/NewCollection";


class MainTabNavigator extends React.Component {
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
}

const HomeStack = createStackNavigator({Home, Collectables, Collectable, CollectableItem});
const CollectionsStack = createStackNavigator({Collections, Collection, NewCollection});
const ProfileStack = createStackNavigator({Profile});
const SettingsStack = createStackNavigator({Settings});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarColor: '#6d3293'
};

CollectionsStack.navigationOptions = {
  tabBarLabel: 'Collections',
  tabBarColor: '#0ca26d'
};

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarColor: '#ff9187'
};

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarColor: '#cbaa00'

};


const RouteIcons = {
  Home: 'home',
  Collections: 'collections',
  Profile: 'person',
  Settings: 'settings'
};

export default createMaterialBottomTabNavigator({
    Home: {screen: HomeStack},
    Collections: {screen: CollectionsStack},
    Profile: {screen: ProfileStack},
    Settings: {screen: SettingsStack}
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let IconComponent = TabBarIcon;
        let iconName = RouteIcons[routeName];
        // if (routeName === 'Home') {
        //   iconName = `home`;
        //   // Sometimes we want to add badges to some icons.
        //   // You can check the implementation below.
        //   IconComponent = HomeIconWithBadge;
        // } else if (routeName === 'Settings') {
        //   iconName = `settings`;
        // }

        // You can return any component that you like here!
        return <IconComponent icon={iconName} size={26} color={tintColor} />;
      },
    })
  }
);