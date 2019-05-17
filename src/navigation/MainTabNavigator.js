import React from 'react';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import {createStackNavigator} from "react-navigation";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import AboutUs from "../screens/AboutUs";
import TabBarIcon from "../components/TabBarIcon";
import Collectable from "../screens/Collectables/Collectable";
import NewCollection from "../screens/Collections/NewCollection";
import {CollectionList} from "../components/Collections/CollectionList";
import {CollectableList} from "../components/Collectables/CollectableList";
import Colors from "../constants/Colors";
import Collection from "../screens/Collections/Collection";

const HomeStack = createStackNavigator({Home, CollectableList, Collectable});
const CollectionsStack = createStackNavigator({Collection, CollectionList, NewCollection, Collectable});
const ProfileStack = createStackNavigator({Profile});
const AboutUsStack = createStackNavigator({AboutUs});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarColor: Colors.turquoise
};

CollectionsStack.navigationOptions = {
  tabBarLabel: 'Favorites',
  tabBarColor: Colors.salmon
};

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarColor: Colors.purple
};

AboutUsStack.navigationOptions = {
  tabBarLabel: 'AboutUs',
  tabBarColor: Colors.yellow
};


const RouteIcons = {
  Home: 'home',
  Favorites: 'favorite',
  Profile: 'person',
  AboutUs: 'settings'
};

//Reorder these if you want to open a different tab by default.
export default createMaterialBottomTabNavigator({
    AboutUs: {screen: AboutUsStack},
    Home: {screen: HomeStack},
    Favorites: {screen: CollectionsStack},
    Profile: {screen: ProfileStack},
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
        // } else if (routeName === 'AboutUs') {
        //   iconName = `settings`;
        // }

        // You can return any component that you like here!
        return <IconComponent icon={iconName} size={26} color={tintColor} />;
      },
    })
  }
);