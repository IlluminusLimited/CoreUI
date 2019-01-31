import React from 'react';
import {createSwitchNavigator, createStackNavigator} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from "../authentication/AuthLoadingScreen";
import SignInScreen from "../authentication/SignInScreen";
import Settings from "../components/Settings";

const AuthStack = createStackNavigator({ SignIn: SignInScreen, Settings: Settings });
const AppStack = createStackNavigator({App: MainTabNavigator, Settings: Settings});

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {initialRouteName: 'AuthLoading'}
);