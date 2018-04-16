import React from 'react';
import { View, StyleSheet, Image} from 'react-native';
import { Container, Text, Card, CardItem, Label, Toast, Content, Spinner, Body,
  Button } from 'native-base';
import AppBar from './../Components/header';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class EventDetails extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      data: [],
      isLoading: false
    }
  }

  componentWillMount(){
    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getEventById', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: this.props.navigation.state.params._id})
    })
      .then(res => {
        if(!res.ok){
          throw Error(res.statusText);
        }
        return res.json()
      })
      .then(res => {
        
        this.setState({data: res.data}, () => {
          this.setState({isLoading: false})
        })
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

  handlePress(){
    let {navigate} = this.props.navigation;
    navigate('eventParticipant', {
      event: this.state.data.name
    })
  }

  render(){
    let {params} = this.props.navigation.state;
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: <Text></Text>
    
    let info = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: 
      <CardItem>
        <Body>
        <Label>Event Name</Label>
        <Text style={styles.info}>{this.state.data.name}</Text>
        </Body>
      </CardItem>

    let venueInfo = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: 
      <CardItem>
        <Body>
        <Label>Day</Label>
        <Text style={styles.info}>{this.state.data.place.day}</Text>
        <Label>Time</Label>
        <Text style={styles.info}>{this.state.data.place.time}</Text>
        <Label>Place</Label>
        <Text style={styles.info}>{this.state.data.place.venue}</Text>
        </Body>
      </CardItem>
    
    return (
      <Container>
        <AppBar title={params.name} left="arrow-back" icon="none" navigation={this.props.navigation} 
        noShadow={true}/>
        <Content>
          <View style={styles.banner}>
              <Text style={styles.bannerText}>
                {this.state.isLoading ? '-' : this.state.data.participantsRegistered} People Registered
              </Text>
              <Text style={{color: '#fff'}}>
                {this.state.isLoading ? '-': this.state.data.participantsAttended} People Attended
              </Text>
          </View>

          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>PRIZE DETAILS</Text>
            </CardItem>
            <CardItem>
              <View style={{flex: 1,flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                  <Image style={{width: 60, height: 60}} source={require('./../prize1.png')}/>
                  <Text style={{fontWeight: '700', fontSize: 23, marginTop: 10}}>&#8377;&nbsp;
                    {this.state.isLoading ? '-' : this.state.data.prize.first}
                  </Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                  <Image style={{width: 60, height: 60}} source={require('./../prize2.png')}/>
                  <Text style={{fontWeight: '700', fontSize: 23, marginTop: 10}}>&#8377;&nbsp;
                    {this.state.isLoading ? '-' : this.state.data.prize.second}
                  </Text>
                </View>
              </View>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>ABOUT EVENT</Text>
            </CardItem>
            {info}
          </Card>
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>VENUE DETAILS</Text>
            </CardItem>
            {venueInfo}
          </Card>
          {params.type === 'admin' ?
          <Card>
            <CardItem header>
              <Text style={{color: GLOBALS.primaryColor}}>ACTIONS</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Button block danger onPress={this.handlePress.bind(this)}>
                  <Text>View Participants</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
          : <Text/>
          }
        </Content>
        <Toast ref={c=>{this.toast = c}} />
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
  }
})