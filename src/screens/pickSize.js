import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Container, Text, Button, Content} from 'native-base';
import AppBar from './../Components/header';
let config = require('./../config');
let GLOBALS = require('./../globals');


export default class PickSize extends React.Component {
  constructor(){
    super();
    this.maptshirtSize = this.maptshirtSize.bind(this);
    this.state = {
      selected: -1
    }
  }

  select(num){
    this.setState({selected: num});
  }

  maptshirtSize(num){
    switch(num){
      case 0:
        return 'Small';
      case 1:
        return 'Medium';
      case 2:
        return 'Large';
      case 3:
        return 'Extra Large';
      case 4:
        return 'XXL';
      default:
        return 'unknown';
    }
  }

  submit(){
    if(this.state.selected != -1){
      let {navigate} = this.props.navigation;
      navigate('reviewSell', {
        name: this.props.navigation.state.params.name,
        email: this.props.navigation.state.params.email,
        phone: this.props.navigation.state.params.phone,
        college: this.props.navigation.state.params.college,
        event: this.props.navigation.state.params.event,
        price: this.props.navigation.state.params.price,
        tshirt: this.maptshirtSize(this.state.selected) 
      });
    }else{
      alert('Please Select A Size !')
    }
  }

  render(){
    return (
      <Container>
        <AppBar title='T-shirt Size' left='arrow-back' navigation={this.props.navigation} />

        <Content>
          <View style={{backgroundColor: '#fff', padding: 10}}>
            <Text style={styles.title}>Choose T-shirt size</Text>

            <View style={styles.grid}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{padding: 7, borderWidth: 1, 
                  borderColor: this.state.selected === 0 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive ,
                  margin: 10}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this.select(0)}>
                    <Image source={require('./../tshirt.jpg')} style={{width: 120, height: 120, resizeMode: 'contain'}} />
                  </TouchableOpacity>
                </View>
                <Text style={{color: this.state.selected === 0 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive}}>
                  Small</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{padding: 7,  borderWidth: 1, 
                  borderColor:this.state.selected === 1 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive,
                  margin: 10}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this.select(1)}>
                    <Image source={require('./../tshirt.jpg')} style={{width: 120, height: 120, resizeMode: 'contain', }} />
                  </TouchableOpacity>
                </View>
                <Text style={{color: this.state.selected === 1 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive}}>
                  Medium</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{padding: 7,  borderWidth: 1, 
                  borderColor: this.state.selected === 2 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive, 
                  margin: 10}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this.select(2)}>
                    <Image source={require('./../tshirt.jpg')} style={{width: 120, height: 120, resizeMode: 'contain', }} />
                  </TouchableOpacity>
                </View>
                <Text style={{color: this.state.selected === 2 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive}}>
                  Large</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{padding: 7,  borderWidth: 1, 
                  borderColor: this.state.selected === 3 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive, 
                  margin: 10}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this.select(3)}>
                    <Image source={require('./../tshirt.jpg')} style={{width: 120, height: 120, resizeMode: 'contain', }} />
                  </TouchableOpacity>
                </View>
                <Text style={{color: this.state.selected === 3 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive}}>
                  XL</Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{padding: 7,  borderWidth: 1,
                  borderColor: this.state.selected === 4 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive,
                  margin: 10}}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this.select(4)}>
                    <Image source={require('./../tshirt.jpg')} style={{width: 120, height: 120, resizeMode: 'contain', }} />
                  </TouchableOpacity>
                </View>
                <Text style={{color: this.state.selected === 4 ? GLOBALS.primaryColor: GLOBALS.primaryColorInactive}}>
                  XXL</Text>
              </View>
            </View>
          </View>
        </Content>
        <View style={{backgroundColor: '#fff', padding: 5}}>
          <Button danger block onPress={() => this.submit()}>
            <Text>Next</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

let styles = StyleSheet.create({
  title: {
    color: GLOBALS.primaryColorDark,
    fontSize: 18
  },

  grid: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  }
});