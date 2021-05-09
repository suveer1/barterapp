import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config'

export default class MyBarter extends Component{
    constructor(){
        super();
        this.state={mydonorintrests:'',donorName:'',status:'',userId:firebase.auth().currentUser.email,id:'',item:''}
    }
    getName=()=>{
      db.collection('users')
      .where('username','==',this.state.userId)
      .get()
      .then(snapshot=>{
        snapshot.forEach(doc=>{
          var name = doc.data().first_name
          this.setState({donorName:name})
        })
      })
    }
    getData=()=>{
        var email = firebase.auth().currentUser.email;
        db.collection("myBarters").where('donor_id','==',email)
        .onSnapshot((snapshot)=>{
            var allBarters = snapshot.docs.map(document => document.data());
            //var i = snapshot.docs.map(document => document.id)
            this.setState({
              mydonorintrests : allBarters,
              status:allBarters.request_status,
              item:allBarters.item_name
              //id:i
            });
        })
        db.collection('myBarters').where('donor_id','==',email).get()
        .then(snapshot=>{
          snapshot.forEach(doc=>{
            this.setState({id:doc.id})
          })
        })
       // console.log("lofof"+this.state.mydonorintrests)
    }
    updateData=(a)=>{
      var email = firebase.auth().currentUser.email;
      db.collection('myBarters').doc(this.state.id).update({
        request_status:'donor sent'
      })
      var id = a.exchange_id
      db.collection('exchange_requests')
      .where('exchangeid','==',id)
      .get()
      .then(snapshot=>{
        snapshot.forEach(doc=>{
          db.collection('exchange_requests')
          .doc(doc.id)
          .update({
            status:'read'
          })
        })
      })
    }

    sendItem=(i)=>{
      if(i.request_status === 'donor sent'){
        var stat = "Item sent"   
        this.sendNotification(i,stat)
      }
      else{
        var stat = "donor Intrested"
        this.sendNotification(i,stat)
      }

    }

    sendNotification=(x,y)=>{
      var exchangeid = x.exchange_id
      var donor_id = x.donor_id
      db.collection('notifications')
      .where('exchangeId','==',exchangeid)
      .where('donor_id','==',donor_id)
      .get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          var message =""
          if(y === 'Item sent'){
            message = this.state.donorName + "has sent u the item" + this.state.item
          }
          else{
            message = this.state.donorName + 'has sent u the item' + this.state.item
          }
          db.collection('notifications').doc(doc.id).update({
            message:message
          })
        })
      })
    }
    componentDidMount(){
        this.getData();
        this.getName();
        console.log("hello")
    }
    keyExtractor=(item,index)=>index.toString()
   
    renderItem=({item})=>(
        <ListItem bottomDivider>
            <ListItem.Content>
            <ListItem.Title style={{fontSize:30,fontWeight:'bold'}}>{ item.item_name}</ListItem.Title>
            <ListItem.Subtitle style={{  
                flex:1,
                fontSize: 20,
                justifyContent:'center',
                alignItems:'center'}}>
                    {'requested by :' + item.requested_by }</ListItem.Subtitle>
                        <ListItem.Subtitle style={{    flex:1,
                fontSize: 20,
                justifyContent:'center',
                alignItems:'center'}}>{'status  :'+item.request_status}</ListItem.Subtitle>
            <View>
                <TouchableOpacity style={{   
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
                    elevation : 16}} 
                    onPress={()=>{this.updateData(item)
                    this.sendItem(item)
                    }}
                    >
                        <Text>{item.request_status === 'donor sent'?"item sent":'exchange'}</Text>
                </TouchableOpacity>
            </View>
            </ListItem.Content>
        </ListItem>
    )
    render(){
        return(
            <View style={{flex:1}}>
              <MyHeader  title="My Barters" navigation={this.props.navigation}/>
              <View style={{flex:1}}>
                {
                  this.state.mydonorintrests.length === 0
                  ?(
                    <View >
                      <Text style={{ fontSize: 20}}>you have not shown intrest in any of Barters</Text>
                    </View>
                  )
                  :(
                    <FlatList
                      keyExtractor={this.keyExtractor}
                      data={this.state.mydonorintrests}
                      renderItem={this.renderItem}
                    />
                  )
                }
              </View>
            </View>
          )
    }
}