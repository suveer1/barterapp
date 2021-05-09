  
import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet } from 'react-native';
import db from '../config';
import firebase from 'firebase';
export default class MyHeader extends Component{
  constructor(props){
    super(props);
    this.state={unread:''}
  }
  getunread=()=>{
    var email = firebase.auth().currentUser.email;
    db.collection('notifications')
    .where('status','==','unread')
    .where('recieverId','==',email)
    .onSnapshot(snapshot=>{
      var length = snapshot.docs.map((doc)=>doc.data())
      this.setState({unread:length.length})
    })
  }
  componentDidMount=()=>{
    this.getunread()
  }
  getIcon=()=>{
    return(
      <View>
      <Icon 
      name='bell'
      type='font-awesome'
      color='orange'
      size={25}
      onPress={()=>{this.props.navigation.navigate('Notifications')}}
      />
      <Badge 
      value={this.state.unread}
      containerStyle={{ position: 'absolute', top: -4, right: -4 }}
      />

      </View>
    )
  }
  render(){
    return(
      <Header 
      leftComponent={<Icon name='bars' type='font-awesome' color='blue' onPress={()=>{this.props.navigation.toggleDrawer()}}/>}
      centerComponent={{text:this.props.title ,style:{color: '#90A5A9', fontSize:20,fontWeight:"bold",}}}
      rightComponent={
      <View>
      <Icon name="bell" type="font-awesome" color="orange" onPress={()=>{this.props.navigation.navigate('Notifications')}}/>
      <Badge 
      value={this.state.unread}
      containerStyle={{ position: 'absolute', top: -4, right: -4 }}
      />
      </View>
    }     
      />
    )
  }
}