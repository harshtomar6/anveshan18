import React from 'react';
import {View, StyleSheet, Image, Linking} from 'react-native';
import { Card, CardItem, Text, Left, Body, Thumbnail, Icon, Button } from 'native-base';
let GLOBALS = require('./../globals');

export default class About extends React.Component {

  openLink(link){  
    Linking.canOpenURL(link).then(supported => {
      if(!supported)
        alert('Cannot handle');
      else
        return Linking.openURL(link);
    }).catch(err => alert(err))
  }

  render(){
    return (
      <View style={styles.container}>
        <Card>
          <CardItem header>
              <Thumbnail style={{width: 45, height: 45}} source={require('./../ic_launcher.png')} />
            <Body>
              <Text style={[styles.heading, {marginTop: 10, marginLeft: 10}]}>Anveshan 18</Text>
            </Body>
          </CardItem>
          <View>
            <Image source={require('./../fun-verve.jpg')} style={{width: '100%', height: 180, resizeMode: 'cover', margin: 0}} />
          </View>
        </Card>
        <Card>
          <CardItem header>
            <Text style={styles.heading}>Designed & Developed By:</Text>
          </CardItem>
          <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 20}}>
            <Thumbnail  style={{width: 110, height: 110, borderRadius: 110, marginBottom: 20}} source={require('./../pp.jpg')} />
            <Text style={styles.heading}>HARSH TOMAR</Text>
            <View style={{flexDirection: 'row', padding: 20}}>
              <Button transparent small onPress={() => {this.openLink('https://m.facebook.com/harsh.tomar.560')}}>
              <Icon name="logo-facebook" style={{margin: 10, color: '#4267b2', fontSize: 28}}/>
              </Button>
              <Button transparent small onPress={() => {this.openLink('https://twitter.com/harshtomar450')}}>
              <Icon name="logo-twitter" style={{margin: 10, color: '#4AB3F4', fontSize: 28}}/>
              </Button>
              <Button transparent small onPress={() => {this.openLink('https://www.linkedin.com/in/harsh-tomar-7a407573/')}}>
              <Icon name="logo-linkedin" style={{margin: 10, color: '#0077B5', fontSize: 28}}/>
              </Button>
            </View>
          </View>
        </Card>
        
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  heading: {
    color: GLOBALS.primaryColor,
    fontWeight: '700',
    fontSize: 17
  }
})
