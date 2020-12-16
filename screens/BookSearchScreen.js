import * as React from 'react'
import {Text, View} from 'react-native'

export default class BookSearchScreen extends React.Component{
    render(){
        return(
            <View style ={{flex:1, justifyContent:'center', alignContent:'center'}}>
               <Text>Book Search</Text> 
            </View>
        )
    }
}