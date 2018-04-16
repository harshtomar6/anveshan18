import React from 'react';
import { View, StyleSheet, Dimensions, AsyncStorage } from 'react-native';
import { Toast, Spinner, Text, Card, CardItem, Label, Body, Button, Icon } from 'native-base';
let GLOBALS = require('./../globals');
let config = require('./../config');

export default class VolunteerHome extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      isLoading: false,
      data:''
    }
  }
  
  componentWillMount(){
    AsyncStorage.getItem('userData').then(val => {
      if(val){
        this.setState({
          data: JSON.parse(val)
        })
        GLOBALS.userData = JSON.parse(val);
      }
    }).done()
  }

  componentWillReceiveProps(newProps){
    if(newProps.refresh){
      this.fetchData(this.state.data._id);
    }
  }

  fetchData(userId){
    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getVolunteerDetail', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: userId})
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
        alert(err)
        this.setState({isLoading: false})
        if(this.toast !== null)
        this.toast._root.showToast({
          text: 'An Error Occured !',
          position: 'bottom',
          buttonText: 'Okay',
          duration: 3000,
          style: {
            backgroundColor: GLOBALS.primaryErrColor
          }
        })
      })
  }

  render(){
    let summary = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} /> :
      this.state.errLoading ? <Text>Err Loading</Text>:
      <Body>
        <Label>Name</Label>
        <Text style={styles.info}>{this.state.data.name}</Text>
        <Label>E-mail</Label>
        <Text style={styles.info}>{this.state.data.email}</Text>
        <Label>USN</Label>
        <Text style={styles.info}>{this.state.data.userid}</Text>
        <Label>Phone</Label>
        <Text style={styles.info}>{this.state.data.phone}</Text>
      </Body>

    return (
      <View style={styles.container}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {this.state.isLoading ? '-': this.state.data.passesSold} Passes Sold
          </Text>
        </View>
    
        <View style={styles.rowContainer}>
          <View style={styles.row}>
            <Button vertical transparent style={styles.btn}
              onPress={() => this.props.handleNav(0)}>
              <Icon name="home" style={{color: GLOBALS.primaryColor, fontSize: 26}}></Icon>
              <Text style={{color: GLOBALS.primaryColor}}>Home</Text>
            </Button>
            <Button vertical transparent style={styles.btn}
              onPress={() => this.props.handleNav(1)}>
              <Icon name="apps" style={{color: GLOBALS.primaryColor, fontSize: 26}}></Icon>
              <Text style={{color: GLOBALS.primaryColor}}>Events</Text>
            </Button>
            <Button vertical transparent style={styles.btn3}
              onPress={() => this.props.handleNav(2)}>
              <Icon name="create" style={{color: GLOBALS.primaryColor, fontSize: 26}}></Icon>
              <Text style={{color: GLOBALS.primaryColor}}>Sell Pass</Text>
            </Button>
            <Button vertical transparent style={styles.btn}
              onPress={() => this.props.handleNav(3)}>
              <Icon name="people" style={{color: GLOBALS.primaryColor, fontSize: 26}}></Icon>
              <Text style={{color: GLOBALS.primaryColor}}>Participant</Text>
            </Button>
            <Button vertical transparent style={styles.btn}
              onPress={() => this.props.navigation.navigate('validateWrap', {type: 'volunteer'})}>
              <Icon name="checkmark" style={{color: GLOBALS.primaryColor, fontSize: 26}}></Icon>
              <Text style={{color: GLOBALS.primaryColor}}>Validate</Text>
            </Button>
            <Button vertical transparent style={styles.btn3}
              onPress={() => this.props.handleNav(4)}>
              <Icon name="information-circle" style={{color: GLOBALS.primaryColor, fontSize: 26}}></Icon>
              <Text style={{color: GLOBALS.primaryColor}}>About</Text>
            </Button>
          </View>
        </View>
        <Card>
          <CardItem header>
            <Text style={{color: GLOBALS.primaryColorDark, fontWeight: '400'}}>PERSONAL DETAILS</Text>
          </CardItem>
          <CardItem>
            {summary}
          </CardItem>
        </Card>
        <Toast ref={e => {this.toast = e}} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  banner: {
    backgroundColor: GLOBALS.primaryColor,
    paddingTop: 60,
    paddingBottom: 60,
    alignItems: 'center',
    justifyContent: 'center' 
  },
  bannerText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '800'
  },
  info: {
    fontSize: 18,
    margin: 10
  },
  rowContainer: {
    backgroundColor: '#fff',
    shadowColor:'rgba(0, 0, 0, 0.2)',
    shadowOffset: {width: 1, height: 2},
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 2,
    marginRight: 2,
  },
  row:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  btn: {
    width: Dimensions.get('screen').width/3 - 2,
    borderRightWidth: 0.5,
    borderRightColor: GLOBALS.primaryColorInactive,
    borderBottomWidth: 0.5,
    borderBottomColor: GLOBALS.primaryColorInactive,
    borderColor: GLOBALS.primaryColorInactive,
    paddingTop: 30,
    paddingBottom: 30,
    borderRadius: 0
  },
  btn3: {
    width: Dimensions.get('screen').width/3 - 1,
    borderBottomWidth: 0.5,
    borderBottomColor: GLOBALS.primaryColorInactive,
    borderColor: GLOBALS.primaryColorInactive,
    paddingTop: 30,
    paddingBottom: 30,
    borderRadius: 0
  }
});