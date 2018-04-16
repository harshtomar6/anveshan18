import React from 'react';
import { StyleSheet, View, Alert, Linking, Modal } from 'react-native';
import { Container, Icon, Right, Body, Content, Card,
   Text, CardItem, Spinner, Toast, Button, Form,
   Item, Label, Input, ActionSheet } from 'native-base';
import AppBar from './../Components/header';
const config = require('./../config');
let GLOBALS = require('./../globals');

export default class VolunteerDetails extends React.Component {

  constructor(){
    super();
    this.callNumber = this.callNumber.bind(this);
    this.toast = null;
    this.state = {
      data: '',
      isLoading: false,
      volunteerId: '',
      passes: '',
    }
  }

  componentWillMount(){
    this.setState({
      volunteerId: this.props.navigation.state.params.volunteerId
    })
  }

  componentDidMount(){
    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getVolunteerDetail', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: this.props.navigation.state.params.volunteerId})
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

  callNumber(phoneNumber){
    Linking.canOpenURL(phoneNumber).then(supported => {
      if(!supported)
        alert('Cannot handle');
      else
        return Linking.openURL(phoneNumber);
    }).catch(err => alert(err))
  }

  handleCollect(){
    let {navigate} = this.props.navigation;
    if(!this.state.isLoading)
      navigate('collectMoney', {
        id: this.state.volunteerId,
        name: this.state.data.name,
        totalMoney: this.state.data.totalMoney - this.state.data.amountCollected
      });
  }

  handleDelete(){
    Alert.alert(
      'Block Volunteer',
      'Are You Sure ? ',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.blockVolunteer},
      ],
      { cancelable: false }
    )
  }

  render(){
    const {params} = this.props.navigation.state;
    let infoColor = this.state.data.passesAlloted === 0 ? '#FC4442': GLOBALS.primaryColorDark
    let moneyInfo = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} /> :
      <CardItem>
          <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: '#FC4442', fontSize: 26, fontWeight: '700', marginBottom: 20}}>
              &#8377;&nbsp;{this.state.data.totalMoney}</Text>
          </View>
      </CardItem>

    let collectionInfo1 = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />:
      <CardItem>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: '700', fontSize: 23,marginBottom: 20}}>&#8377;&nbsp;
            {this.state.data.amountCollected}
          </Text>
        </View>
      </CardItem>

    let collectionInfo2 = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />:
      <CardItem>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: '700', fontSize: 23, marginBottom: 20}}>&#8377;&nbsp;
            {this.state.data.totalMoney - this.state.data.amountCollected}
          </Text>
        </View>
      </CardItem>

    let info = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} /> : 
      <CardItem>
        <Body>
          <Label>Name</Label>
          <Text style={styles.info}>{this.state.data.name}</Text>
          <Label>E-mail</Label>
          <View style={styles.row}>
            <View style={{width: '90%'}}>
              <Text style={styles.info}>{this.state.data.email}</Text>
            </View>
            <View>
              <Button transparent 
                onPress={() => this.callNumber(`mailto:${this.state.data.email}`)}>
                <Icon name="mail" style={{fontSize: 22, color: '#FC4442'}}/>
              </Button>
            </View>
          </View>
          <Label>USN</Label> 
          <Text style={styles.info}>{this.state.data.userid}</Text>
          <Label>Phone</Label>
          <View style={styles.row}>
            <View style={{width: '75%'}}>
              <Text style={styles.info}>{this.state.data.phone}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Button transparent title='Call Now'
                onPress={() => this.callNumber(`tel:+91${this.state.data.phone}`)}>
                <Icon name="call" style={{fontSize: 22}}/>
              </Button>
              <Button transparent title='Send SMS'
                onPress={() => this.callNumber(`sms:+91${this.state.data.phone}`)}>
                <Icon name='text' style={{fontSize: 24, marginLeft: 10}} />
              </Button>
            </View>
          </View>
        </Body>
      </CardItem> 

    return (
      <Container>
        <AppBar title={params.volunteerName ? params.volunteerName: this.state.isLoading ? '-': this.state.data.name} 
          left='arrow-back' icon='none' navigation={this.props.navigation} noShadow />
        
        <Content>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {params.passesSold >= 0 ? params.passesSold : this.state.isLoading ? '-' : this.state.data.passesSold } 
                &nbsp;Passes Sold</Text>
          </View>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>TOTAL CONTRIBUTION</Text>
            </CardItem>
            {moneyInfo}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>AMOUNT COLLECTED</Text>
            </CardItem>
            {collectionInfo1}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>AMOUNT PENDING</Text>
            </CardItem>
            {collectionInfo2}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>VOLUNTEER INFO</Text>
            </CardItem>
            {info}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>ACTIONS</Text>
            </CardItem>
            <CardItem>
              <Body>
              <Button block primary onPress={this.handleCollect.bind(this)}>
                <Text>Collect Money</Text>
              </Button>
              <Text></Text>
              <Text></Text>
              <Button block danger onPress={this.handleDelete.bind(this)}>
                <Text>Block Volunteer</Text>
              </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>
        <Toast ref={(c) => {this.toast = c; }} />
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: GLOBALS.primaryColor,
    paddingTop: 50,
    paddingBottom: 50,
    alignItems: 'center'
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
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalOuterContainer: {
    flex: 1, 
    justifyContent: 'center', 
    paddingLeft: 25, 
    paddingRight: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalInnerContainer: {
    padding: 20,
    paddingBottom: 5,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {width: 2, height: 10},
    shadowRadius: 3,
    borderRadius: 2
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: 20
  },
  modalSubTitle:{
    marginTop: 15,
    marginBottom: 15,
    fontWeight: '200'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20
  }  
})