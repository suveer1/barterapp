import React,{Component} from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity,Alert } from 'react-native';
import { ListItem ,Icon} from 'react-native-elements'
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config'

export default class Item extends Component{
    constructor(){
        super();
        this.state={allitems:''}
    }
    getData=()=>{
        var user = firebase.auth().currentUser.email
        db.collection('recieveditems').where('username','==',user)
        .onSnapshot(snapshot =>{
            var all = snapshot.docs.map(doc =>doc.data())
            this.setState({allitems:all})
        })
    }
    componentDidMount(){
        this.getData()
    }
    keyExtractor=(item,i)=>i.toString();
    renderItem=({item})=>(
        
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'bold',fontSize:20,color:'black'}}>{item.item}</ListItem.Title>
                <ListItem.Subtitle>{item.Date}</ListItem.Subtitle>
 </ListItem.Content>
        </ListItem>
    )
    render(){
        console.log('hello'+this.state.allitems)
        return(
            <View>
                <MyHeader title="recived items" navigation={this.props.navigation}/>
                {this.state.allitems.length === 0 ? <Text>you have not recieved anything</Text>
            :( <FlatList 
                
                keyExtractor={this.keyExtractor}
                data={this.state.allitems}
                renderItem={this.renderItem}
                />)    
            }
               
            </View>
        )
    }
}