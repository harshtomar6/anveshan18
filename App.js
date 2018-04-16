import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { AsyncStorage } from 'react-native'
import { Root, Toast, ActionSheet } from 'native-base';
import SocketIOClient from 'socket.io-client';
import HomeScreen from './src/screens/homeScreen';
import Login from './src/screens/login';
import Signup from './src/screens/signup';
import Splash from './src/screens/splashScreen';
import VolunteerScreen from './src/screens/volunteerScreen';
import volunteerDetails from './src/screens/volunteerDetails';
import VolunteerSearch from './src/screens/volunteerSearch';
import ReviewSell from './src/screens/reviewSell';
import ParticipantDetails from './src/screens/participantDetails';
import ParticipantSearch from './src/screens/participantSearch';
import EventDetails from './src/screens/eventDetails';
import UpdateEvent from './src/screens/updateEvent';
import PickEvents from './src/screens/pickEvents';
import Validate from './src/screens/validate';
import Success from './src/screens/success';
import ValidateWrap from './src/screens/validateWrap';
import PickSize from './src/screens/pickSize';
import EventParticipant from './src/screens/eventParticipant';
import CollectMoney from './src/screens/collectMoney';
import ChooseEvents from './src/screens/chooseEvents';
const config = require('./src/config');
const GLOBALS = require('./src/globals');

const RootNavigator = StackNavigator({
  splash: {screen: Splash},
  Home: {screen: HomeScreen},
  Login: {screen: Login},
  Signup: {screen: Signup},
  Volunteer: {screen: VolunteerScreen},
  volunteerDetails: {screen: volunteerDetails},
  volunteerSearch: {screen: VolunteerSearch},
  reviewSell: {screen: ReviewSell},
  participantDetails: {screen: ParticipantDetails},
  participantSearch: {screen: ParticipantSearch},
  eventDetails: {screen: EventDetails},
  updateEvent: {screen: UpdateEvent},
  pickEvents: {screen: PickEvents},
  validate: {screen: Validate},
  success: {screen: Success},
  validateWrap: {screen: ValidateWrap},
  pickSize: {screen: PickSize},
  eventParticipant: {screen: EventParticipant},
  collectMoney: {screen: CollectMoney},
  chooseEvents: {screen: ChooseEvents}
},{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
})

export default class App extends Component {

  constructor(){
    super();
    this.socket = SocketIOClient(config.SERVER_URI);
    GLOBALS.socket = this.socket;
  }

  componentWillUnmount(){
    Toast.toastInstance = null;
    ActionSheet.actionsheetInstance = null;
  }

  render() {
    return (
      <Root>
        <RootNavigator />
      </Root>      
    );
  }
}

