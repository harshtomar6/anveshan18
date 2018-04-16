import React from 'react';
import { View, StatusBar, StyleSheet, Image, AsyncStorage } from 'react-native';
import { Container, Icon, Button, Input, Item, Form, Text,
  Toast, Spinner, Content, ActionSheet } from 'native-base';
import { NavigationActions } from 'react-navigation';
const remote = require('./../login-back.jpg');
const config = require('./../config.js');
let GLOBALS = require('./../globals');

export default class Signup extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.validateInputs = this.validateInputs.bind(this);
    this.state = {
      name: '',
      usn: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isLoading: false,
      err: false
    }
  }

  componentWillUnmount() { 
    Toast.toastInstance = null;
    ActionSheet.actionsheetInstance = null;
  }

  handleSubmit(){
    let data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      userid: this.state.usn,
      phone: this.state.phone
    }

    const moveToVolunteer = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Volunteer'})
      ]
    })

    if(this.validateInputs() === 1){
      this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/addVolunteer', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
        .then(res => {
          if(!res.ok){
            throw Error(res.statusText);
          }
          return res.json()
        })
        .then(res => {
          this.setState({isLoading: false})

          AsyncStorage.setItem('userType', 'Volunteer')
          AsyncStorage.setItem('userData', JSON.stringify(res.data))
          this.props.navigation.dispatch(moveToVolunteer);
          GLOBALS.socket.emit('record-activity', {
            type: 'REGISTER',
            owner: {
              id: res.data._id,
              name: this.state.name
            }
          })
        })
        .catch(err => {
          this.setState({isLoading: false})
          if(this.toast !== null)
          return this.toast._root.showToast({config: {
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

    if(this.state.usn.length !== 10)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'USN must be of 10 letters !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})

    if(!(this.state.usn.startsWith('1js') || this.state.usn.startsWith('1JS')))
      if(this.toast !== null)
        return this.toast._root.showToast({config: {
          text: 'Invalid USN !',
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

    if(this.state.password.length === 0)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'Password cannot be left blank !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})

    if(this.state.password !== this.state.confirmPassword)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'Password do not match !',
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
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <Container>
      <Content>
      <View style={styles.container}>
        <StatusBar backgroundColor='#000' />
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={remote} />
        </View>
        <View style={styles.overlay} />
        <View style={styles.col1}>
        <Image style={styles.logo} source={require('./../main_logo.png')} />
        </View>
        <View style={styles.col2}>
          <Form>
          <Item rounded style={styles.input}>
            <Icon name="person" style={{color: '#000'}} />
            <Input placeholder="Full Name" placeholderTextColor='rgba(0,0,0,0.6)'
              onChangeText={text => this.setState({name: text})}
              value={this.state.name}
              style={{color: '#000'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="key" style={{color: '#000'}} />
            <Input placeholder="USN" placeholderTextColor='rgba(0,0,0,0.6)'
              onChangeText={text => this.setState({usn: text})}
              value={this.state.usn}
              style={{color: '#000'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="mail" style={{color: '#000'}} />
            <Input placeholder="E-mail" placeholderTextColor='rgba(0,0,0,0.6)'
              onChangeText={text => this.setState({email: text})}
              keyboardType='email-address'
              value={this.state.email}
              style={{color: '#000'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="call" style={{color: '#000'}} />
            <Input placeholder="Phone" placeholderTextColor='rgba(0,0,0,0.6)'
              onChangeText={text => this.setState({phone: text})}
              keyboardType='numeric'
              value={this.state.phone}
              style={{color: '#000'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="lock" style={{color: '#000'}} />
            <Input placeholder="Password" placeholderTextColor='rgba(0,0,0,0.6)'
              onChangeText={text => this.setState({password: text})}
              value={this.state.password}
              secureTextEntry style={{color: '#000'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="lock" style={{color: '#000'}} />
            <Input placeholder="Confirm Password" placeholderTextColor='rgba(0,0,0,0.6)'
              onChangeText={text => this.setState({confirmPassword: text})}
              value={this.state.confirmPassword}
              returnKeyType='go'
              onSubmitEditing={this.handleSubmit.bind(this)}
              secureTextEntry style={{color: '#000'}} />
          </Item>
          <Button block style={styles.btn} 
            onPress={this.handleSubmit.bind(this)}>
            <Text>Signup</Text>
          </Button>
          {showSpinner}
          </Form>
        </View>
      </View>
      </Content>
      <Toast ref={c => {this.toast = c}} />
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',  
  },
  imageContainer : {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  image : {
    flex: 1,
    resizeMode: 'cover'
  },
  overlay : {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFF01',
    opacity: 0.9
  },
  logo:{
    width: '100%',
    height: 220,
    resizeMode: 'stretch'
  },
  col1:{
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  col2: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    zIndex: 5,
    paddingBottom: 40
  },
  heading: {
    fontSize: 38,
    color: '#fff',
    fontWeight: '900'
  },
  input: {
    marginTop: 15, 
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 0
  },
  btn: {
    backgroundColor: GLOBALS.primaryColorDark, 
    borderRadius: 25,
    marginTop: 15,
    height: 50,
    elevation: 0
  }
})