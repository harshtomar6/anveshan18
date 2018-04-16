import React from 'react';
import { View, StyleSheet, AsyncStorage, Dimensions, Image } from 'react-native';
import { Text, Button, Body, Card, CardItem, Form, Item, Label, Input, Toast } from 'native-base';
import { TextField } from 'react-native-material-textfield';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class SellPass extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      userData : null,
      name: '',
      email: '',
      phone: '',
      college: ''
    }
  }

  handleSubmit(){
    if(this.validateInputs() === 1){
      const { navigate } = this.props.navigation;
      navigate('pickEvents', {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        college: this.state.college
      });
    }
  }

  validateInputs(){
    if(this.state.name.length === 0)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'Name cannot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    
    if(this.state.email.length === 0)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'E-mail cannot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    
    if(!(this.state.email.contains('@') && this.state.email.contains('.')) || this.state.email.contains('@.'))
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'Invalid E-mail !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    
    if(this.state.phone.length !== 10)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'Phone should be of 10 digits !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})

    if(this.state.college.length === 0)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'College name cannnot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})

    return 1;
  }

  render(){
    return (
      <View style={styles.container}>
          <View style={{backgroundColor: '#fff'}}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={require('./../grad.png')} />
          </View>
          <View style={styles.infohero}>
            <Text style={{color: '#fff', fontWeight: '800', fontSize: 22}}>
              {GLOBALS.userData.passesSold} Passes Sold
            </Text>
          </View>
          <View style={{marginTop: 50}}>
          <View style={styles.header}>
            <Text style={{color: GLOBALS.primaryColorDark}}>ENTER PARTICIPANT DETAILS</Text>
          </View>
          <View style={styles.body}>
            <TextField
              label='Name'
              value={this.state.name}
              onChangeText={ (name) => this.setState({ name })}
              tintColor={GLOBALS.primaryColor} 
            />
            <TextField
              label='E-mail'
              value={this.state.email}
              onChangeText={ (email) => this.setState({ email })}
              tintColor={GLOBALS.primaryColor}
              keyboardType="email-address" 
            />
            <TextField
              label='Phone'
              value={this.state.phone}
              onChangeText={ (phone) => this.setState({ phone })}
              tintColor={GLOBALS.primaryColor}
              keyboardType="numeric" 
            />
            <TextField
              label='College'
              value={this.state.college}
              onChangeText={ (college) => this.setState({ college })}
              tintColor={GLOBALS.primaryColor} 
            />
            <Button block danger style={{marginTop: 20}}
              onPress={this.handleSubmit.bind(this)}>
              <Text>PICK EVENTS</Text>
            </Button>
            
          </View>
          </View>
        </View>
        <Toast ref={c => {this.toast =c }} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    height: Dimensions.get('screen').height - 130,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  infohero: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('screen').width,
    backgroundColor: 'transparent',
    paddingTop: 25,
    paddingBottom: 30,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header:{
    paddingTop: 25,
    paddingLeft: 15
  },
  body: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  imageContainer : {
    top: 0,
    left: 0,
    width: Dimensions.get('screen').width,
    height: 50
  },
  image : {
    height: 90,
    resizeMode: 'stretch'
  },
  overlay : {
    position: 'relative',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: 0.7
  }
})