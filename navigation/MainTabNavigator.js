import React from 'react';
import {View} from "react-native";
import {Button, IconButton, Text, TextInput} from "react-native-paper";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import {createStackNavigator} from "react-navigation";
import Home from "../screens/Home";
import Collections from "../screens/Collections";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";


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

const HomeStack = createStackNavigator({Home}, {
  defaultNavigationOptions: {
    header: null
  }
});
const CollectionsStack = createStackNavigator({Collections}, {
  defaultNavigationOptions: {
    header: null
  }
});
const ProfileStack = createStackNavigator({Profile}, {
  defaultNavigationOptions: {
    header: null
  }
});
const SettingsStack = createStackNavigator({Settings}, {
  defaultNavigationOptions: {
    header: null
  }
});


HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  // tabBarIcon: <TabBarIcon name={'md-home'}/>,
  color: '#6d3293'
};

CollectionsStack.navigationOptions = {
  tabBarLabel: 'Collections',
  // tabBarIcon: <TabBarIcon name={'md-home'}/>,

};

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  // tabBarIcon: <TabBarIcon name={'md-home'}/>,

};

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  // tabBarIcon: <TabBarIcon name={'md-home'}/>,

};
class IconWithBadge extends React.Component {
  render() {
    const { icon, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 26, height: 26, margin: -10, right: 10 }}>
        <IconButton icon={icon} size={size} color={color} />
        { badgeCount > 0 && (
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
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{badgeCount}</Text>
          </View>
        )}
      </View>
    );
  }
}
const HomeIconWithBadge = (props) => {
  // You should pass down the badgeCount in some other ways like react context api, redux, mobx or event emitters.
  return <IconWithBadge {...props} badgeCount={3} />;
};

const RouteIcons = {
  Home: 'home',
  Collections: 'collections',
  Profile: 'person',
  Settings: 'settings'
};

export default createMaterialBottomTabNavigator({
    Home: {screen: HomeStack, },
    Collections: {
      screen: CollectionsStack, icon: 'collections',
      color: '#0ca26d'
    },
    Profile: {screen: ProfileStack, icon: 'person', color: '#ff9187'},
    Settings: {screen: SettingsStack, icon: 'settings', color: '#b0af00'}
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = IconButton;
        let iconName = RouteIcons[navigation.state.routeName];
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
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);