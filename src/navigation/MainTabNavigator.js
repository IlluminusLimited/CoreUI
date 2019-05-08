import React from 'react';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import {createStackNavigator} from "react-navigation";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import TabBarIcon from "../components/TabBarIcon";
import Collectable from "../screens/Collectables/Collectable";
import NewCollection from "../screens/Collections/NewCollection";
import Collections from "../screens/Collections";
import {CollectionList} from "../components/Collections/CollectionList";
import {CollectableList} from "../components/Collectables/CollectableList";
import Colors from "../constants/Colors";
import Collection from "../screens/Collections/Collection";


class MainTabNavigator extends React.Component {
  state = {
    index: 0,
    routes: [
      {key: 'home', title: 'Home', icon: 'home', color: Colors.purple},
      {key: 'collections', title: 'Collections', icon: 'collections', color: Colors.turquoise},
      {key: 'profile', title: 'Profile', icon: 'person', color: Colors.salmon},
      {key: 'settings', title: 'Settings', icon: 'settings', color: Colors.yellow}
    ]
  };
}

const HomeStack = createStackNavigator({Home, CollectableList, Collectable});
const CollectionsStack = createStackNavigator({Collections, CollectionList, NewCollection, Collection});
const ProfileStack = createStackNavigator({Profile});
const SettingsStack = createStackNavigator({Settings});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarColor: Colors.purple
};

CollectionsStack.navigationOptions = {
  tabBarLabel: 'Collections',
  tabBarColor: Colors.turquoise
};

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarColor: Colors.salmon
};

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarColor: Colors.yellow
};


const RouteIcons = {
  Home: 'home',
  Collections: 'collections',
  Profile: 'person',
  Settings: 'settings'
};

//Reorder these if you want to open a different tab by default.
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