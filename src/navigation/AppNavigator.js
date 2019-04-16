import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import Home from "../screens/Home";
import {CollectableList} from "../components/Collectables/CollectableList";
import Collectable from "../screens/Collectables/Collectable";


export default createAppContainer(createStackNavigator({Home, CollectableList, Collectable}));