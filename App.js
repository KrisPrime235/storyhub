import * as React from 'react';
import { Image } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs'

import BookTScreen from './screens/BookTScreen'
import BookSearchScreen from './screens/BookSearchScreen'

export default class App extends React.Component {
  render(){
  return (
   <AppContainer/>
    );
  }
}
const TabNavigator = createBottomTabNavigator({
  Transaction : {screen :BookTScreen },
  Search:{screen : BookSearchScreen}
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:()=>{
      const routeName = navigation.state.routeName
      if (routeName === "Transaction"){
        return(
          <Image source={require("./assets/book.png")} style={{width:30, height:30}}/>
        )
      } else {
        return(
          <Image source={require("./assets/searchingbook.png")} style={{width:30, height:30}}/>
        )
      }
    }
  })
});

const AppContainer = createAppContainer(TabNavigator)



