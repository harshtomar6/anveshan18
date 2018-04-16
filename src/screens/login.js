import React from 'react';
import { View, StatusBar, StyleSheet, Image, AsyncStorage } from 'react-native';
import { Container, Icon, Button, Input, Item, Form, Text,
  Toast, Spinner, ActionSheet } from 'native-base';
import { NavigationActions } from 'react-navigation';
const remote = require('./../login-back.jpg');
const config = require('./../config.js');
let GLOBALS = require('./../globals');

export default class Login extends React.Component {

  constructor(){
    super();
    this.validateInputs = this.validateInputs.bind(this);
    this.toast = null;
    this.state = {
      username: '',
      password: '',
      isLoading: false,
      err: false
    }
  }

  handleSubmit(){
    const removeFromStack = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Home'})
      ]
    })

    const moveToVolunteer = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Volunteer'})
      ]
    })

    if(this.validateInputs() === 1){
      if(this.state.username === 'Superuser'){
        if(this.state.password === 'ibmhf$100'){
          AsyncStorage.setItem("userType", "Admin");
          return this.props.navigation.dispatch(removeFromStack);
        }
        else{
          if(this.toast !== null)
          return this.toast._root.showToast({config: {
            text: 'Wrong Password for Superuser !',
            position: 'bottom',
            buttonText: 'Okay',
            duration: 3000,
            style: {
              backgroundColor: '#096C47'
            }
          }})
        }
      }else{
        this.setState({isLoading: true})
        fetch(config.SERVER_URI+'/loginVolunteer', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userid: this.state.username,
            password: this.state.password
          })
        })
        .then(res => {
          return res.json()
        })
        .then(res => {
          if(res.err)
            throw res.err;
          this.setState({isLoading: false})
          
          AsyncStorage.setItem('userType', 'Volunteer');
          AsyncStorage.setItem('userData', JSON.stringify(res.data));
          this.props.navigation.dispatch(moveToVolunteer);
          GLOBALS.userData = res.data;

          GLOBALS.socket.emit('record-activity', {
            type: 'LOGIN',
            owner: {
              id: res.data._id,
              name: res.data.name
            }
          });
        })
        .catch((err) => {
          //alert(err);
          this.setState({isLoading: false})
          if(this.toast !== null)
          this.toast._root.showToast({config: {
            text: err.toString(),
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
  }

  validateInputs(){
    if(this.state.username.length === 0)
      if(this.toast !== null)
      return this.toast._root.showToast({config: {
        text: 'Username cannot be left blank !',
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

    return 1;
  }

  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    const { navigate } = this.props.navigation;
    return (
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
            <Icon name="person" style={{color: '#000'}}/>
            <Input placeholder="USN" placeholderTextColor='rgba(0,0,0,0.6)'
              onChangeText={text => this.setState({username: text})}
              value={this.state.username}
              style={{color: '#000'}} />
          </Item>
          <Item rounded style={styles.input}>
            <Icon name="lock" style={{color: '#000'}}/>
            <Input placeholder="password" placeholderTextColor='rgba(0,0,0,0.6)'
              onChangeText={text => this.setState({password: text})}
              value={this.state.password}
              returnKeyType='go'
              onSubmitEditing={this.handleSubmit.bind(this)}
              secureTextEntry style={{color: '#000'}} />
          </Item>
          <Button block style={styles.btn} 
            onPress={this.handleSubmit.bind(this)}>
            <Text>Login</Text>
          </Button>       
          {showSpinner}
          </Form>
          <Button block danger style={styles.signupBtn}
            onPress={() => navigate('Signup')}>
            <Text style={{color: GLOBALS.primaryColorDark}}>Become A Volunteer</Text>
          </Button>
        </View>
        <Toast ref={c => {this.toast = c;}} />
      </View>
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
    height: 250,
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
    zIndex: 5
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
  },
  signupBtn: { 
    borderRadius: 25,
    marginTop: 15,
    height: 50,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: GLOBALS.primaryColorDark,
    elevation: 0,
  }
})