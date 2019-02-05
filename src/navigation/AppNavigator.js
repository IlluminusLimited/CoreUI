import React from 'react';
import {createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from "../screens/authentication/AuthLoadingScreen";
import SignInScreen from "../screens/authentication/SignInScreen";

const AuthStack = createStackNavigator({SignIn: SignInScreen});
const AppStack = MainTabNavigator;

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {initialRouteName: 'App'}
))