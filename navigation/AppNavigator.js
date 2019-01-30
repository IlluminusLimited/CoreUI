import React from 'react';
import {createSwitchNavigator, createStackNavigator} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from "../authentication/AuthLoadingScreen";
import SignInScreen from "../authentication/SignInScreen";

const AuthStack = createStackNavigator({ SignIn: SignInScreen });
const AppStack = createStackNavigator({App: MainTabNavigator});

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {initialRouteName: 'AuthLoading'}
);