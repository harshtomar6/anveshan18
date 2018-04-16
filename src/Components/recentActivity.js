import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { List, ListItem, Text, Spinner, Left, Body, Right,
  Thumbnail, Icon, Toast } from 'native-base';
let GLOBALS = require('./../globals');
let config = require('./../config');
import SocketIOClient from 'socket.io-client';

export default class RecentActivity extends React.Component {
  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this)
    this.state = {
      data: [],
      isLoading: false
    }
  }

  componentWillMount(){

    if(GLOBALS.recentActivityFull.length > 0){
      this.setState({data: GLOBALS.recentActivityFull})
    }
    else{
      this.fetchData()
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.refresh){
      this.fetchData();
    }
  }

  fetchData(){
    this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getAllRecentActivity')
        .then(res => {
          if(!res.ok){
            throw Error(res.statusText);
          }
          return res.json()
        })
        .then(res => {
          this.setState({isLoading: false})
  
          GLOBALS.recentActivityFull = res.data
          this.setState({data: res.data})
        })
        .catch(err => {
          this.setState({isLoading: false})
          if(this.toast !== null)
          this.toast._root.showToast({config: {
            text: 'An Error Occured !',
            position: 'bottom',
            buttonText: 'Okay',
            duration: 3000,
            style: {
              backgroundColor: GLOBALS.primaryErrColor
            }
          }})
        })
  }

  componentDidMount(){
    GLOBALS.socket.on('new-activity', data => {
      //alert(this.state.data.length);
      let d = this.state.data;
      d.unshift(data);
      this.setState({data: d}, () => {
        GLOBALS.recentActivityFull = this.state.data
        //this.forceUpdate()
        //alert(this.state.data.length)
      });
    })
  }

  getRecentActivityIcon(type){
    let icon = '';

    switch(type){
      case 'REGISTER':
        icon = require('./../volunteer-thumbnail.png');
        break;
      case 'PASS_SOLD':
        icon = require('./../dollarIcon.png');
        break;
      case 'LOGIN':
        icon = require('./../login.png');
        break;
      case 'LOGOUT':
        icon = require('./../logout.png');
        break;
      case 'MONEY_COLLECT':
        icon = require('./../dollarIcon2.png');
        break;
      default:
        icon = require('./../7.png');
    }

    return icon;
  }

  handlePress(volunteerId, volunteerName){
    const { navigate } = this.props.navigation;
    if(volunteerId === 'admin'){}
    
    else
      navigate('volunteerDetails', {
        volunteerId,
        volunteerName
      })
  }

  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <View style={styles.container}>
        {showSpinner}
        {
          this.state.isLoading ? <Text></Text> : this.state.data.length > 0 ?
          <List dataArray={this.state.data}
          renderRow={item => 
            <ListItem button avatar 
              onPress={() => this.handlePress(item.owner.id, item.owner.name)}>
              <Left>
                <Thumbnail style={{width: 45, height: 45}} source={this.getRecentActivityIcon(item.type)} />
              </Left>
              <Body>
                <Text>{item.description}</Text>
                <Text note>{new Date(item.time).toDateString()},&nbsp; 
                  {new Date(item.time).toTimeString().split('GMT')[0]}
                </Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"></Icon>
              </Right>
            </ListItem>  
          }></List>
        :
            <View style={styles.innerContainer}>
              <Image source={require('./../sad.png')} style={{ width: 120, height: 120}}/>
                <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
                  No Activity Yet !
                </Text>
                <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
                  All Activity Will Appear Here
                </Text>
            </View>
        }
        <Toast ref={c => {this.toast = c}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  innerContainer: {
    flex: 1,
    height: Dimensions.get('window').height*0.78,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});