import React from 'react';
import { View, StyleSheet, ListView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Body, Text, Button, Spinner, Toast, CheckBox, 
  Separator, Left, Card, CardItem, Right, Footer, Icon } from 'native-base';
import AppBar from './../Components/header';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class PickEvents extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      data: [],
      isLoading: false,
      checked: false,
      category: {},
      selected: [],
      totalPrice: 0
    }
  }

  componentWillMount(){
    if(GLOBALS.events.length > 0){
      this.setState({data: GLOBALS.events})
    }
    else
      this.fetchData();
  }

  componentWillReceiveProps(newProps){
    if(newProps.refresh)
      this.fetchData()
  }

  fetchData(){
    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getEvents')
      .then(res => {
        if(!res.ok){
          throw Error(res.statusText);
        }
        return res.json()
      })
      .then(res => {
        this.setState({isLoading: false})
        
        GLOBALS.events = res.data
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

  handlePress(_id, name){
    const { navigate } = this.props.navigation;
    navigate('eventDetails', {
      _id,
      name,
      type: this.props.type
    })
  }

  handleTshirtPress(){
    let {navigate} = this.props.navigation;

    navigate('pickSize', {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      phone: this.props.navigation.state.params.phone,
      college: this.props.navigation.state.params.college,
      event: ['T-shirt only'],
      price: 200
    })
  }

  handleBothPick(){
    let {navigate} = this.props.navigation;

    navigate('pickSize', {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      phone: this.props.navigation.state.params.phone,
      college: this.props.navigation.state.params.college,
      event: [
        "QR Hunt",
        "Type And Test",
        "Mini Cricket",
        "Blind Coding",
        "Beg Borrow Steal",
        "Mini BasketBall",
        "Tech Quiz",
        "4 Pics 1 Word",
        "Debugging",
        "Mobile Game"
      ],
      price: 300
    })
  }

  handleEventsPick(){
    let { navigate } = this.props.navigation;
    navigate('reviewSell', {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      phone: this.props.navigation.state.params.phone,
      college: this.props.navigation.state.params.college,
      event: [
        "QR Hunt",
        "Type And Test",
        "Mini Cricket",
        "Blind Coding",
        "Beg Borrow Steal",
        "Mini BasketBall",
        "Tech Quiz",
        "4 Pics 1 Word",
        "Debugging",
        "Mobile Game"
      ],
      price: 150,
      tshirt: 'none'
    })
  }

  render(){
    
    return (
      <Container>
        <AppBar title='Choose Combo' left='arrow-back' navigation={this.props.navigation} />
        
        <Content>
          <View style={{flex: 1, backgroundColor: '#fff', paddingLeft: 5, paddingRight: 5}}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.handleBothPick()}>
            <Card>
              <View>
                <Image source={require('./../events-only.jpg')} style={{width: '100%', height: 180, resizeMode: 'stretch', margin: 0}} />
                <View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontWeight: '900', color: '#fff', fontSize: 28}}>Events + Tshirt</Text>
                </View>
              </View>
              <CardItem>
                <Body>
                  <Text note>All Events + Anveshan T-shirt</Text>
                  <Text note>Price: &#8377;&nbsp;300</Text>
                </Body>
                            
              </CardItem>
            </Card>
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.handleEventsPick()}>
            <Card>
              <View>
                <Image source={require('./../events-only.jpg')} style={{width: '100%', height: 180, resizeMode: 'stretch', margin: 0}} />
                <View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontWeight: '900', color: '#fff', fontSize: 28}}>Events Only</Text>
                </View>
              </View>
              <CardItem>
                <Body>
                  <Text note>All Events included</Text>
                  <Text note>Price: &#8377;&nbsp;150</Text>
                </Body>            
              </CardItem>
            </Card>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.handleTshirtPress()}>
            <Card>
              <View>
                <Image source={require('./../events-only.jpg')} style={{width: '100%', height: 180, resizeMode: 'stretch', margin: 0}} />
                <View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontWeight: '900', color: '#fff', fontSize: 28}}>T-shirt Only</Text>
                </View>
              </View>
              <CardItem>
                <Body>
                  <Text note>Only Anveshan T-shirt </Text>
                  <Text note>Price: &#8377;&nbsp;200</Text>
                </Body>     
              </CardItem>
            </Card>
            </TouchableOpacity>
          </View>
        </Content>
        <Toast ref={c=>{this.toast = c}} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: GLOBALS.primaryColor,
    margin: 10,
    fontSize: 14
  },
  footer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 20,
    width: Dimensions.get('window').width -30,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: GLOBALS.primaryColor,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerTitle: {
    color: '#fff',
    fontSize: 15
  }
});