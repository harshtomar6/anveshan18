import React from 'react';
import {View, StyleSheet, AsyncStorage, Dimensions, Image} from 'react-native';
import {List, ListItem, Text, Thumbnail, Icon, Body, Right, Spinner, Toast, Left} from 'native-base';
import AppBar from './../Components/header';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class EventParticipant extends React.Component {
  
  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      userData: null,
      data: [],
      isLoading: false
    }
  }

  componentWillMount(){
    this.fetchData();
  }

  componentWillReceiveProps(newProps){
    if(newProps.refresh){
      this.fetchData()
    }
  }

  fetchData(){
      this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getParticipantsByEvent', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          event: this.props.navigation.state.params.event
        })
      })
        .then(res => {
          if(!res.ok){
            throw Error(res.statusText);
          }
          return res.json()
        })  
        .then(res => {
          this.setState({isLoading: false})
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

  handlePress(participantId, participantName, _id, eventsRegistered, eventsAttended){
    const { navigate } = this.props.navigation;
    navigate('participantDetails', {
      participantId,
      participantName,
      _id,
      eventsRegistered,
      eventsAttended,
      type: 'admin'
    })
  }
  
  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <View style={styles.container}>
        <AppBar title='Participants' left='arrow-back' navigation={this.props.navigation}/>
        {showSpinner}
        {
          this.state.isLoading ? <Text></Text> : this.state.data.length > 0 ?
          <List dataArray={this.state.data}
          renderRow={item => 
            <ListItem button avatar 
              onPress={() => this.handlePress(item.id, item.name, item._id, item.eventsRegistered.length, item.eventsAttended)}>
              <Left>
                <Thumbnail style={{width: 45, height: 45}} source={require('./../participant.png')} />
              </Left>
              <Body>
                <Text>{item.name}</Text>
                <Text note>Events Registered: {item.eventsRegistered.length}</Text>
                <Text note>
                  Events Attended: {item.eventsAttended.length > 1 ? item.eventsAttended.length : 
                    item.eventsAttended[0] === 'none' ? '0': '1'}
                </Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"></Icon>
              </Right>
            </ListItem>  
            }></List>:
            <View style={styles.innerContainer}>
              <Image source={require('./../sad.png')} style={{ width: 120, height: 120}}/>
                <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
                  No Participants Yet !
                </Text>
                <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
                  Your Participants Will Appear Here
                </Text>
            </View>
        }
          <Toast ref={c => {this.toast = c;}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  tabStyle: {
    backgroundColor: GLOBALS.primaryColor
  },
  innerContainer: {
    flex: 1,
    height: Dimensions.get('window').height*0.78,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})