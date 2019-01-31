import React from 'react';
import {Ionicons} from "react-native-vector-icons";
import {View} from "react-native";
import {Button, Text, TextInput} from "react-native-paper";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import Home from "../screens/Home";
import Collections from "../screens/Collections";
import Settings from "../screens/Settings";

const Profile = () => <Text>poo</Text>;

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
const HomeIconWithBadge = (props) => {
  // You should pass down the badgeCount in some other ways like react context api, redux, mobx or event emitters.
  return <IconWithBadge {...props} badgeCount={3} />;
}

class IconWithBadge extends React.Component {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Ionicons name={name} size={size} color={color} />
        { badgeCount > 0 && (
          <View style={{
            // If you're using react-native < 0.57 overflow outside of the parent
            // will not work on Android, see https://git.io/fhLJ8
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: 'red',
            borderRadius: 6,
            width: 12,
            height: 12,
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
export default createMaterialBottomTabNavigator({
    Home: {screen: Home, renderIcon: 'home', color: '#6d3293'},
    Collections: {
      screen: Collections, icon: 'collections',
      color: '#0ca26d'
    },
    Profile: {screen: Profile, icon: 'person', color: '#ff9187'},
    Settings: {screen: Settings, icon: 'settings', color: '#b0af00'}
  },
  // {
  //   defaultNavigationOptions: ({ navigation }) => ({
  //     // tabBarIcon: ({ focused, horizontal, tintColor }) => {
  //     //   const { routeName } = navigation.state;
  //     //   let IconComponent = Ionicons;
  //     //   let iconName;
  //     //   if (routeName === 'Home') {
  //     //     iconName = `ios-information-circle${focused ? '' : '-outline'}`;
  //     //     // Sometimes we want to add badges to some icons.
  //     //     // You can check the implementation below.
  //     //     IconComponent = HomeIconWithBadge;
  //     //   } else if (routeName === 'Settings') {
  //     //     iconName = `ios-options${focused ? '' : '-outline'}`;
  //     //   }
  //     //
  //     //   // You can return any component that you like here!
  //     //   return <IconComponent name={iconName} size={25} color={tintColor} />;
  //     // },
  //   }),
  //   // tabBarOptions: {
  //   //   activeTintColor: 'tomato',
  //   //   inactiveTintColor: 'gray',
  //   // },
  // }
);





//
//
// import {
//   createBottomTabNavigator,
//   createStackNavigator,
//   createAppContainer,
// } from 'react-navigation';
//
// class DetailsScreen extends React.Component {
//   render() {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Details!</Text>
//         <TextInput />
//       </View>
//     );
//   }
// }
//
// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         {/* other code from before here */}
//         <Button
//           mode={'contained'}
//           onPress={() => this.props.navigation.navigate('Details')}
//         >Go to Details</Button>
//       </View>
//     );
//   }
// }
//
// class SettingsScreen extends React.Component {
//   render() {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         {/* other code from before here */}
//         <Button
//           mode={'contained'}
//           onPress={() => this.props.navigation.navigate('Details')}
//         >Go to Details</Button>
//       </View>
//     );
//   }
// }
//
// const HomeStack = createStackNavigator({
//   Home: HomeScreen,
//   Details: DetailsScreen,
// });
//
// const SettingsStack = createStackNavigator({
//   Settings: SettingsScreen,
//   Details: DetailsScreen,
// });
//
// export default createAppContainer(createBottomTabNavigator(
//   {
//     Home: HomeStack,
//     Settings: SettingsStack,
//   },
//   {
//     navigationOptions: {
//       tabBarLabel: "anus"
//     }
//     /* Other configuration remains unchanged */
//   }
// ));