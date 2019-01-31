import React from 'react';
import {createSwitchNavigator, createStackNavigator} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from "../authentication/AuthLoadingScreen";
import SignInScreen from "../authentication/SignInScreen";
import Settings from "../components/Settings";
import Home from "../components/Home";
import Collections from "../components/Collections";

const AuthStack = createStackNavigator({ SignIn: SignInScreen });
const AppStack = createStackNavigator({App: MainTabNavigator, Home: Home, Collections: Collections,  Settings: Settings});

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {initialRouteName: 'AuthLoading'}
);