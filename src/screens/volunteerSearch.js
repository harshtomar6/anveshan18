import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Header, Content, Text, Left, Button,
  Icon, Item, Input, Body, Form, List, ListItem, Right, Thumbnail, Separator } from 'native-base';
const GLOBALS = require('./../globals');
let config = require('./../config');

export default class VolunteerSearch extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      searchText: '',
      participantList: '',
      volunteerList: '',
      searchResultVolunteer: [],
      searchResultParticipant: [],
      isLoading: false
    }
  }

  componentWillMount(){
    if(GLOBALS.participantList.length === 0){
      this.fetchData();
      this.setState({volunteerList: GLOBALS.volunteerList})
    }else
      this.setState({participantList: GLOBALS.participantList, volunteerList: GLOBALS.volunteerList})
  }

  fetchData(){
    this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getParticipants')
        .then(res => {
          if(!res.ok){
            throw Error(res.statusText);
          }
          return res.json()
        })
        .then(res => {
          this.setState({isLoading: false})
          
          GLOBALS.participantList = res.data
          this.setState({participantList: res.data})
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
  
  handleChange(text){
    let result = [], result2 = []
    this.setState({searchText: text, searchResultVolunteer: [], searchResultParticipant: []}, () => {
      result = this.state.searchResultVolunteer;
      result2 = this.state.searchResultParticipant
    })
    let i=0,j=0;

    if(text == '')
      return this.setState({searchResultVolunteer: [], searchResultParticipant: []})

    this.state.volunteerList.forEach((item) => {
      i++;
      if(item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1){
        result.push(item);
      }else{
        //let index = this.state.volunteerList.indexOf(item);
        //if(index !== -1)
          //result.splice(index, 1);
      }

      if(i === this.state.volunteerList.length){  
        this.setState({searchResultVolunteer: result})
      }
    })

    this.state.participantList.forEach((item) => {
      j++;
      if(item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1){
        result2.push(item);
      }else{
        //let index = this.state.volunteerList.indexOf(item);
        //if(index !== -1)
          //result.splice(index, 1);
      }

      if(j === this.state.participantList.length){  
        this.setState({searchResultParticipant: result2})
      }
    })
  }

  handlePress(volunteerId, volunteerName, passesSold){
    const { navigate } = this.props.navigation;
    navigate('volunteerDetails', {
      volunteerId,
      volunteerName,
      passesSold
    })
  }

  handlePressParticipant(participantId, participantName, _id, eventsRegistered, eventsAttended){
    const { navigate } = this.props.navigation;
    navigate('participantDetails', {
      participantId,
      participantName,
      _id,
      eventsRegistered,
      eventsAttended,
      type: 'admin'
    })
  }

  render(){
    const { goBack } = this.props.navigation;
    return (  
      <Container>
        <Header androidStatusBarColor={GLOBALS.primaryColorDark}
           style={styles.header} searchBar rounded>
          <Left>  
            <Button transparent onPress={() => goBack()}>
              <Icon name='arrow-back' style={{color: '#fff'}} />
            </Button>
          </Left> 
          <Item style={{left: -60}}>
            <Input placeholder='Search by name' 
              onChangeText={(text) => this.handleChange(text)} autoFocus={!this.state.isLoading}
              editable={!this.state.isLoading}/>
          </Item>
        </Header>
        <View style={{backgroundColor: '#fff', borderBottomWidth: 0.2, borderBottomColor: '#c1c1c1'}}>
          <Text>{this.state.isLoading ? 'Fetching Participants...': ''}</Text>
          <Text style={{color: GLOBALS.primaryColorInactive, margin: 10}}>
            Search Results for&nbsp;  
            <Text style={{color: GLOBALS.primaryColorDark}}>
               {this.state.searchText}
            </Text>
          </Text>
        </View>
        <Content>
          
          <View style={{backgroundColor:'#fff'}}>
          <Separator bordered>
          <Text style={styles.title}>
            {this.state.searchText === '' ? '' : 'Volunteers: ' +this.state.searchResultVolunteer.length}
          </Text>
          </Separator>
          <List dataArray={this.state.searchResultVolunteer}
                 renderRow={item => 
                   <ListItem button avatar
                     onPress={() => this.handlePress(item._id, item.name, item.passesSold)}>
                     <Left>
                       <Thumbnail style={{width: 45, height: 45}} source={require('./../volunteer-thumbnail.png')} />
                     </Left>
                     <Body>
                       <Text>{item.name}</Text>
                       <Text note>Passes Sold: {item.passesSold}</Text>
                     </Body>
                     <Right>
                       <Icon name="arrow-forward"></Icon>
                     </Right>
                   </ListItem>  
               }></List> 
            <Separator bordered>
            <Text style={styles.title}>
              {this.state.searchText === '' ? '' : 'Participants: '+this.state.searchResultParticipant.length}
            </Text>
            </Separator>
            <List dataArray={this.state.searchResultParticipant}
          renderRow={item => 
            <ListItem button avatar
              onPress={() => this.handlePressParticipant(item.id, item.name, item._id, item.eventsRegistered.length, item.eventsAttended)}>
              <Left>
                <Thumbnail style={{width: 45, height: 45}} source={require('./../participant.png')} />
              </Left>
              <Body>
                <Text>{item.name}</Text>
                <Text note>Events Registered: {item.eventsRegistered.length}</Text>
                <Text note>
                  Events Attended: {item.eventsAttended.length > 1 ? item.eventsAttended.length : 
                    item.eventsAttended[0] === 'none' ? '0': '1'}
                </Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"></Icon>
              </Right>
            </ListItem>  
            }></List>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: GLOBALS.primaryColor
  },
  title: {
    color: GLOBALS.primaryColor,
    margin: 10,
    fontSize: 14
  }
})