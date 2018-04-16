import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { Container, Header, Content, Text, Left, Button,
  Icon, Item, Input, Body, Form, List, ListItem, Right, Thumbnail, Toast } from 'native-base';
const GLOBALS = require('./../globals');
let config = require('./../config');

export default class ParticipantSearch extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      searchText: '',
      participantList: '',
      searchResult: [],
      isLoading: false
    }
  }

  componentWillMount(){
    if(GLOBALS.participantList.length === 0){
      this.fetchData();
    }else
      this.setState({participantList: GLOBALS.participantList})
  }

  fetchData(){
    this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getVolunteerParticipants', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: GLOBALS.userData._id
      })
    })
      .then(res => {
        if(!res.ok){
          throw Error(res.statusText);
        }
        return res.json()
      })
      .then(res => {
        this.setState({isLoading: false});
        GLOBALS.participantList = res.data
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

  handleChange(text){
    let result = []
    this.setState({searchText: text, searchResult: []}, () => {
      result = this.state.searchResult;
    })
    let i=0;

    if(text == '')
      return this.setState({searchResult: []})

    this.state.participantList.forEach((item) => {
      i++;
      if(item.name.toLowerCase().indexOf(text.toLowerCase()) !== -1){
        result.push(item);
      }else{
        //let index = this.state.volunteerList.indexOf(item);
        //if(index !== -1)
          //result.splice(index, 1);
      }

      if(i === this.state.participantList.length){  
        this.setState({searchResult: result})
      }
    })
  }

  handlePress(participantId, participantName, _id, eventsRegistered, eventsAttended){
    const { navigate } = this.props.navigation;
    navigate('participantDetails', {
      participantId,
      participantName,
      _id,
      eventsRegistered,
      eventsAttended,
      type: this.props.type
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
            <Input placeholder='Search by name or ID' 
              onChangeText={(text) => this.handleChange(text)} autoFocus={!this.state.isLoading}
              editable={!this.state.isLoading && this.state.participantList.length > 0}/>
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
          <List dataArray={this.state.searchResult}
          renderRow={item => 
            <ListItem button avatar
              onPress={() => this.handlePress(item.id, item.name, item._id, item.eventsRegistered.length, item.eventsAttended)}>
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
        <Toast ref={c => {this.toast = c}} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: GLOBALS.primaryColor
  }
})