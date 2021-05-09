import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput,KeyboardAvoidingView,TouchableOpacity,Alert, ToastAndroid } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader'

export default class Exchange extends Component{

  constructor(){
    super()
    this.state = {
      userName : firebase.auth().currentUser.email,
      itemName : "",
      description : "",
      isActive:false,
      docid:'',
      name:'',
      status:'',
      eid:'',
      number:'',
      target:''
    }
  }
createUniqueId=()=>{
  return Math.random().toString(36).substring(5);
}
  addItem=(itemName, description)=>{
    var userName = this.state.userName
    db.collection("exchange_requests").add({
      "username"    : userName,
      "item_name"   : itemName,
      "description" : description,
      'exchangeid':this.createUniqueId(),
      "status":'unread'
     })
     db.collection('users').doc(this.state.docid).update({
       active:true
     })
    
     this.setState({
       itemName : '',
       description :''
     })

     this.setState({
       itemName : '',
       description :''
     })

     // NOTE: Comment below return statement when you test the app in ios
     // ToastAndroid.showWithGravityAndOffset('Item ready to exchange',
     //    ToastAndroid.SHORT,
     //  );
     // return this.props.navigation.navigate('HomeScreen')

     // NOTE:  Comment the below return statement when you test the app in android
     return Alert.alert(
          'Item ready to exchange',
          '',
          [
            {text: 'OK', onPress: () => {

              this.props.navigation.navigate('HomeScreen')
            }}
          ]
      );
  }
getactive=()=>{
  db.collection('users').where('username','==',this.state.userName)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      this.setState({isActive:doc.data().active,docid:doc.id})
    })
  })
}

getName=()=>{
   db.collection('exchange_requests')
  .where('username','==',this.state.userName)
  .get()
  .then((snapshot)=>{
  snapshot.forEach((doc)=>{
    var data =doc.data()
    if(data.status != 'recieved')
    this.setState({name:data.item_name,status:data.status,eid:doc.id,number:data.exchangeid})
  })  
  })
}
componentDidMount(){
  this.getactive()

  this.getName();
}
getTodaysDate=()=>{
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  today = dd + '-' + mm + '-' + yyyy;
  return today;
}
update=()=>{
  db.collection('users').doc(this.state.docid)
  .update({
    active:false
  })
      db.collection('exchange_requests').doc(this.state.eid).update({
        status:'recieved'
      })
      db.collection('recieveditems').add({
        exchangeid:this.state.number,
        item:this.state.name,
        username:this.state.userName,
        Date:this.getTodaysDate()
      })
  
}
sendNotification=()=>{
  db.collection('notifications')
  .where('exchangeId','==',this.state.number)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var t = doc.data().donor_id
      var n = doc.data().recieverName
      db.collection('notifications')
      .add({
        recieverId:t,
        message : n + "" + "has recieved the item " + this.state.name,
        status:'unread'
      })
    })
  })
}
  render(){
        if(this.state.isActive){
      return(
        <View>
          <View style={{display:'flex',justifyContent:'space-around',borderWidth:1}}>
          <Text style={{fontSize:20,fontWeight:'bold',marginTop:30}}>{this.state.name}</Text>
          </View>
          <View style={{display:'flex',justifyContent:'space-around',borderWidth:1}}>
          <Text style={{fontWeight:'bold',fontSize:20}}>{this.state.status}</Text>
          </View>
          <TouchableOpacity style={{width:400,height:40,alignItems:'center',display:'flex',backgroundColor:'orange'}}
            onPress={()=>{this.update()
            this.getactive()
            this.sendNotification()
            }}
>
            <Text>i have recieved the item</Text>
          </TouchableOpacity>
        </View>
        
        

      )
    }
    else{
    return(
      <View style={{flex:1}}>
      <MyHeader title="Add Item" navigation={this.props.navigation}/>
      <KeyboardAvoidingView style={{flex:1,justifyContent:'center', alignItems:'center'}}>
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Item Name"}
          maxLength ={8}
          onChangeText={(text)=>{
            this.setState({
              itemName: text
            })
          }}
          value={this.state.itemName}
        />
        <TextInput
          multiline
          numberOfLines={4}
          style={[styles.formTextInput,{height:100}]}
          placeholder ={"Description"}
          onChangeText={(text)=>{
            this.setState({
              description: text
            })
          }}
          value={this.state.description}

        />
        <TouchableOpacity
          style={[styles.button,{marginTop:10}]}
          onPress = {()=>{this.addItem(this.state.itemName, this.state.description)
          this.getactive()
          this.getName()
          }}
          >
          <Text style={{color:'#ffff', fontSize:18, fontWeight:'bold'}}>Add Item</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      </View>
    )
        }
  }
}


const styles = StyleSheet.create({
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },

})