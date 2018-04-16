import React from 'react';
import { View, StyleSheet, ListView, Image, Dimensions } from 'react-native';
import { Container, List, ListItem, Body, Right, Left, Button, Toast, Radio,
  Text, Content, Footer, Thumbnail, Spinner } from 'native-base';
import AppBar from './../Components/header';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class Validate extends React.Component {
  
  constructor(){
    super();
    this.toast = null;
    this.handleCheck = this.handleCheck.bind(this);
    this.state = {
      selected: '',
      isSelect: false,
      isLoading: false,
      data: [],
      date: '',
      validated: false
    }
  }

  componentWillMount(){
    let eventsRegistered = this.props.navigation.state.params.eventsRegistered;
    let eventsAttended = this.props.navigation.state.params.eventsAttended;

    let date = new Date().getUTCDate();
    let month = new Date().getUTCMonth() + 1;

    this.setState({
      data: eventsRegistered.filter((e) => eventsAttended.indexOf(e) == -1),
      date: date,
      month: month
    })
  }

  handleCheck(item){;
    this.setState({
      selected: item
    })
  }

  handleSubmit(){
    if(this.state.selected.length == 0){
      if(this.toast !== null)
        this.toast._root.showToast({config: {
          text: 'Pick A Event !',
          position: 'bottom',
          buttonText: 'Okay',
          duration: 3000,
          style: {
            backgroundColor: GLOBALS.primaryErrColor
          }
        }})
    }
    else{
      if(!this.state.isLoading){
        this.setState({isLoading: true})
        fetch(config.SERVER_URI+'/validateParticipant', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: this.props.navigation.state.params.participantId, name: this.state.selected})
        })
        .then(res => {
          this.setState({isLoading: false})
          if(!res.ok){
            if(this.toast !== null)
            return this.toast._root.showToast({config: {
              text: "Internal Server Error",
              position: 'bottom',
              buttonText: 'Okay',
              duration: 3000,
              style: {
                backgroundColor: GLOBALS.primaryErrColor
              }
            }})
          }
          let data = this.state.data;
          
          GLOBALS.socket.emit('record-activity', {
            type: 'VALIDATE',
            owner: {
              id: GLOBALS.userData._id || 'admin',
              name: GLOBALS.userData.name || 'Admin',
              participant: this.props.navigation.state.params.participantId,
              event: this.state.selected
            }
          })
          data.splice(data.indexOf(this.state.selected), 1)
          this.setState({data: data}, () => {
            this.setState({selected: ''})
          });
          alert('Participant Validated !');
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
      else
        alert('Your request is being processed');
    }
  }

  render(){
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const { params } = this.props.navigation.state;
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColor} />: <Text></Text>
    return (
      <Container>
        <AppBar title="Validate" left="arrow-back" navigation={this.props.navigation}/>

        <Content style={{backgroundColor: '#fff'}}>
        { this.state.date >= 5 && this.state.month >= 2 ? 
          this.state.data.length > 0 ?
          <View style={{backgroundColor: '#fff'}}>
          <Text style={{color: GLOBALS.primaryColor, margin: 15}}>PICK AN EVENT</Text>
          <ListView dataSource={ds.cloneWithRows(this.state.data)}
            renderRow={ item => 
              <ListItem button avatar onPress={() => {this.handleCheck(item)}}>
                <Left>
                  <Thumbnail style={{width: 45, height: 45}} source={require('./../7.png')} />
                </Left>
                <Body>
                  <Text>{item}</Text>
                  <Text></Text>
                  <Text></Text>
                </Body>
                <Right>
                  <View style={this.state.selected === item ? styles.radioActive: styles.radioInactive}>
                    <View style={this.state.selected === item ? styles.innerradioActive: styles.innerradioInactive}> 

                    </View>
                  </View>
                </Right>
              </ListItem>
            }>
          </ListView>
          </View>:
            <View style={styles.innerContainer}>
              <Image source={require('./../sad.png')} style={{ width: 120, height: 120}}/>
                <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
                  Participant Has Attended All Events !
                </Text>
            </View>:
            <View style={styles.innerContainer}>
            <Image source={require('./../sad.png')} style={{ width: 120, height: 120}}/>
              <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
                Wait Till The Big Day !
              </Text>
          </View>
        }
          {showSpinner}
        </Content>
        {this.state.date >= 5 && this.state.month >= 2? this.state.data.length > 0 ?
        <View style={{padding: 5, backgroundColor:'#fff'}}>
          <Button block danger onPress={this.handleSubmit.bind(this)}>
            <Text>Validate Participant</Text>
          </Button>
        </View>:<Text></Text>:<Text></Text>
        }
        <Toast ref={c => {this.toast = c}} />
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  radioInactive:{
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: GLOBALS.primaryColorInactive,
    borderRadius: 25
  },

  radioActive: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: GLOBALS.primaryColor,
    padding: 2,
    borderRadius: 25
  },
  
  innerradioActive: {
    backgroundColor: GLOBALS.primaryColor,
    width: '100%',
    height: '100%',
    borderRadius: 25,
    flex: 1
  },

  innerradioInactive: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    borderRadius: 25,
    flex: 1
  },
  
  innerContainer: {
    flex: 1,
    height: Dimensions.get('window').height*0.78,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})