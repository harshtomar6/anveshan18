import React from 'react';
import { StyleSheet, View, StatusBar, Image, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Text } from 'native-base';
const remote = require('./../splash-back.jpg');
const logoURI = require('./../main_logo.png');

export default class Splash extends React.Component {
  
  componentDidMount(){
    let userType = '';
    let removeFromStack;

    AsyncStorage.getItem('userType').then((val) => {
      userType = val;
      if(userType == 'Admin')
        removeFromStack = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: 'Home'})
          ]
        })
      else if(userType == 'Volunteer')
        removeFromStack = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: 'Volunteer'})
          ]
        })
      else
        removeFromStack = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: 'Login'})
          ]
        })

      setTimeout(() => {
        //navigate('Home');
        this.props.navigation.dispatch(removeFromStack);
      }, 2000);
    }).done();
  }
  
  render(){
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#FFFF01' barStyle="dark-content" />
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={remote} />
        </View>
        <View style={styles.overlay} />
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={logoURI} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'  
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
  logoContainer:{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'transparent',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '100%',
    height: 250,
    resizeMode: 'stretch'
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
  text: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '900'
  }
})