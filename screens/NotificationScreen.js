import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput,KeyboardAvoidingView,TouchableOpacity,Alert, ToastAndroid ,FlatList,Dimensions} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader'
import {Card,Header,Icon,ListItem} from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
export default class Notifications extends Component{
    constructor(){
        super();
        this.state={all_notifications:''}
    }
    getNotifications=()=>{
        var user = firebase.auth().currentUser.email
        db.collection('notifications')
        .where('recieverId','==',user)
        .where('status','==','unread')
        .onSnapshot((snapshot)=>{
            var allNotifications =  []
            snapshot.docs.map((doc) =>{
              var notification = doc.data()
              notification["doc_id"] = doc.id
              allNotifications.push(notification)
            });
            this.setState({
                all_notifications:allNotifications
            });
          })
          console.log(this.state.all_notifications)
    }
    componentDidMount(){
        this.getNotifications();
    }
    updateMarkAsread =(notification)=>{
        db.collection("notifications").doc(notification.doc_id).update({
          "status" : "read"
        })
      }
    
    
      onSwipeValueChange = swipeData => {
        var allNotifications = this.state.all_notifications
          const {key,value} = swipeData;
    
          if(value < -Dimensions.get('window').width){
            const newData = [...allNotifications];
            const prevIndex = allNotifications.findIndex(item => item.key === key);
            this.updateMarkAsread(allNotifications[prevIndex]);
            newData.splice(prevIndex, 1);
            this.setState({allNotifications : newData})
        };
    };
    keyExtractor=(item,index)=>index.toString()
    renderItem=data=>(
        <ListItem bottomDivider>
            <ListItem.Content >
                <ListItem.Title style={{fontSize:20,fontWeight:'bold'}}>
                    {data.item.message}
                </ListItem.Title>
            </ListItem.Content>
        </ListItem>
    )
    renderHiddenItem = () => (
        <View style={styles.rowBack}>
            <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <Text style={styles.backTextWhite}></Text>
            </View>
        </View>
    );
    render(){
        //console.log('hello'+this.state.all_notifications)
        return(
            <View>
                <MyHeader title="Notifications" navigation={this.props.navigation}/>
                {
                    this.state.all_notifications.length === 0
                    ?
                    (
                        <Text style={{marginTop:'50%',alignSelf:'center'}}>you have no notifications</Text>
                    )
                    :(
                        <SwipeListView
                        disableRightSwipe
                        data={this.state.all_notifications}
                        renderItem={this.renderItem}
                        renderHiddenItem={this.renderHiddenItem}
                        rightOpenValue={-Dimensions.get('window').width}
                        previewRowKey={'0'}
                        previewOpenValue={-10}
                        previewOpenDelay={3000}
                        onSwipeValueChange={this.onSwipeValueChange}
                        keyExtractor={(item,index)=>item.key}
                    />
                    )
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
        fontWeight:'bold',
        fontSize:15
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#29b6f6',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
    },
    backRightBtnRight: {
        backgroundColor: '#29b6f6',
        right: 0,
    },
});