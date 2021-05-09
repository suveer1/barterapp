import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen'
import Exchange from './screens/ExchangeScreen';
import SettingScreen from './screens/SettingScreen';
import customSidebarMenu from './components/customSideBarMenu';
import ReciverDetails from './screens/ReciverDetailScreen';
import MyBarter from './screens/MyBarterScreen';
import Notifications from './screens/NotificationScreen';
import Item from './screens/itemrecived';
export default function App() {
  return (
    <AppContainer/>
  );
}
const StackNavigator = createStackNavigator({
  BarterList:{
    screen:HomeScreen,
    navigationOptions:{
      headerShown:false
    }
  },
  ReciverDetails:{
    screen:ReciverDetails,
    navigationOptions:{
      headerShown:false
    }
  },
},
{

initialRouteName:'BarterList'
  
})
const TabNavigator = createBottomTabNavigator({
    HomeScreen: {screen: StackNavigator},
    Exchange: {screen: Exchange},
  },
  {
    defaultNavigationOptions: ({navigation})=>({
      tabBarIcon: ()=>{
        const routeName = navigation.state.routeName;
        if(routeName === "HomeScreen"){
          return(
            <Image
            source={require("./assets/home-icon.png")}
            style={{width:20, height:20}}
          />
          )

        }
        else if(routeName === "Exchange"){
          return(
            <Image
            source={require("./assets/ads-icon.png")}
            style={{width:20, height:20,}}
          />)

        }
      }
    })
  }
);

const AppDrawNavigator = createDrawerNavigator({

  RecivedItems:{
    screen:Item
  },
  MyBarters:{
    screen:MyBarter
  },
  Notifications:{
    screen:Notifications
  },
  Home : {
    screen : TabNavigator
    },
  Settings : {
    screen : SettingScreen
    }
  },
  {
    contentComponent:customSidebarMenu
  },
  {
    initialRouteName : 'Home'
  })

const switchNavigator = createSwitchNavigator({
  WelcomeScreen:{screen: WelcomeScreen},
  AppDrawNavigator : AppDrawNavigator,
})

const AppContainer =  createAppContainer(switchNavigator);