import React from 'react';
import { View, StyleSheet} from 'react-native';
import {Container, Content, Text, Item, Button, Toast} from 'native-base';
import { TextField } from 'react-native-material-textfield';
import AppBar from './../Components/header';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class UpdateEvent extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      name: '',
      team: '',
      ticket: '',
      type: '',
      day: '',
      time: '',
      place: '',
      organiserName: '',
      contact: '',
      firstPrize: '',
      secondPrize: ''
    }
  }

  componentWillMount(){
    const {params} = this.props.navigation.state;

    this.setState({
      name: params.name,
      team: params.team,
      ticket: params.ticket,
      type: params.type,
      day: params.day,
      time: params.time,
      place: params.place,
      organiserName: params.organiserName,
      contact: params.contact,
      firstPrize: params.firstPrize,
      secondPrize: params.secondPrize
    })

  }

  handleSubmit(){

  }

  render(){
    const {params} = this.props.navigation.state
    return (
      <Container>
        <AppBar title='Update Event' left="arrow-back" icon="none" navigation={this.props.navigation}/>
        
        <Content>
          <View style={{backgroundColor: '#fff'}}>
            <View style={styles.header}>
              <Text style={{color: GLOBALS.primaryColorDark}}>UPDATE EVENT DETAILS</Text>
            </View>
            <View style={styles.body}>
              <TextField
                label='Event Name'
                value={this.state.name}
                onChangeText={ (name) => this.setState({ name })}
                tintColor={GLOBALS.primaryColor} 
              />
              <TextField
                label='No. per Team'
                value={this.state.team}
                onChangeText={ (team) => this.setState({ team })}
                tintColor={GLOBALS.primaryColor}
              />
              <TextField
                label='Ticket Price'
                value={this.state.ticket}
                onChangeText={ (ticket) => this.setState({ ticket })}
                tintColor={GLOBALS.primaryColor}
                keyboardType="numeric" 
              />
              <TextField
                label='Day'
                value={this.state.day}
                onChangeText={ (day) => this.setState({ day })}
                tintColor={GLOBALS.primaryColor} 
              />
              <TextField
                label='Time'
                value={this.state.time}
                onChangeText={ (time) => this.setState({ time })}
                tintColor={GLOBALS.primaryColor} 
              />
              <TextField
                label='Place'
                value={this.state.place}
                onChangeText={ (place) => this.setState({ place })}
                tintColor={GLOBALS.primaryColor} 
              />
              <TextField
                label='Organiser Name'
                value={this.state.organiserName}
                onChangeText={ (organiserName) => this.setState({ organiserName })}
                tintColor={GLOBALS.primaryColor} 
              />
              <TextField
                label='Contact'
                value={this.state.contact}
                onChangeText={ (contact) => this.setState({ contact })}
                tintColor={GLOBALS.primaryColor} 
              />
              <TextField
                label='First Prize'
                value={this.state.firstPrize}
                onChangeText={ (firstPrize) => this.setState({ firstPrize })}
                tintColor={GLOBALS.primaryColor} 
              />
              <TextField
                label='Second Prize'
                value={this.state.secondPrize}
                onChangeText={ (secondPrize) => this.setState({ secondPrize })}
                tintColor={GLOBALS.primaryColor} 
              />

              <Button block danger style={{marginTop: 20}}
                onPress={this.handleSubmit.bind(this)}>
                <Text>Submit</Text>
              </Button>
              <Toast ref={c => {this.toast =c }} />
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    paddingTop: 25,
    paddingLeft: 15
  },
  body: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  }
})