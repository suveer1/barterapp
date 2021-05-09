import React,{Component} from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity,Alert } from 'react-native';
import { ListItem ,Icon} from 'react-native-elements'
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config'

export default class HomeScreen extends Component{
  constructor(){
    super()
    this.state = {
      allRequests : '',
      user:firebase.auth().currentUser.email
    }
  this.requestRef= null
  }

  getAllRequests =()=>{
 db.collection("exchange_requests")
 .where('status','==','unread')
    .onSnapshot((snapshot)=>{
      var allRequests = []
      snapshot.forEach((doc) => {
          allRequests.push(doc.data())
      })
      this.setState({allRequests:allRequests})
    })
  }
  alert=()=>{
    return Alert.alert("you cannot exchange item yourself");
  }
  componentDidMount(){
    this.getAllRequests()
  }
  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item} ) =>(
   <ListItem bottomDivider>
     <ListItem.Content>
       <ListItem.Title style={{fontWeight:'bold'}}>
         {item.item_name}
       </ListItem.Title>
       <ListItem.Subtitle>
         {item.description}
       </ListItem.Subtitle>
       <View>
         {item.username != this.state.user 
         ?( <TouchableOpacity style={{  
          width:100,
 height:30,
 justifyContent:'center',
 alignItems:'center',
 backgroundColor:"#ff5722",
 shadowColor: "#000",
 shadowOffset: {
    width: 0,
    height: 8
  },
  marginLeft:200}}
  
  onPress={()=>{this.props.navigation.navigate('ReciverDetails',{'details':item})}}
  >
     <Text>exchange</Text>
      </TouchableOpacity>
      ):(
        <TouchableOpacity style={{ width:100,
          height:30,
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:"#ff5722",
          shadowColor: "#000",
          shadowOffset: {
             width: 0,
             height: 8
           },
           marginLeft:200}}
           onPress={()=>{this.alert()}}
           >
          <Text>exchange</Text>
        </TouchableOpacity>
      )
         }
        
       </View>
     </ListItem.Content>
   </ListItem>
  )





  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Barter App" navigation={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.allRequests.length === 0
            ?(
              <View style={{flex:1, fontSize: 20, justifyContent:'center', alignItems:'center'}}>
                <Text style={{ fontSize: 20}}>List of all Barter</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allRequests}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
     marginLeft:200
  }
})