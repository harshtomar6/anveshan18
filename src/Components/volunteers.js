import React from 'react';
import { View, StyleSheet, AsyncStorage, Image, Dimensions } from 'react-native';
import {List, ListItem, Text, Body, Right, Icon, Spinner, Toast,
  Left, Thumbnail, Tabs, Tab } from 'native-base';
import Participants from './Participants';
const config = require('./../config');
let GLOBALS = require('./../globals');

export default class Volunteers extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      data: [],
      isLoading: false
    }
  }

  componentWillMount(){

    if(GLOBALS.volunteerList.length > 0){
      this.setState({data: GLOBALS.volunteerList})
      //this.props.isLoading(false)
    }
    else{
      this.fetchData()
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.refresh){
      this.fetchData()
    }
  }

  fetchData(){
    this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getVolunteers')
        .then(res => {
          if(!res.ok){
            throw Error(res.statusText);
          }
          return res.json()
        })
        .then(res => {
          this.setState({isLoading: false})
          
          GLOBALS.volunteerList = res.data
          this.setState({data: res.data})
          //this.props.isLoading(false)
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

  categorizeList(name){
    let dividerLabel = name[0];


  }

  handlePress(volunteerId, volunteerName, passesSold){
    const { navigate } = this.props.navigation;
    navigate('volunteerDetails', {
      volunteerId,
      volunteerName,
      passesSold
    })
  }

  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <View style={styles.container}>
          {showSpinner}
          {
          this.state.isLoading ? <Text></Text> : this.state.data.length > 0 ?
          <List dataArray={this.state.data}
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
          }></List>:
            <View style={styles.innerContainer}>
              <Image source={require('./../sad.png')} style={{ width: 120, height: 120}}/>
                <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
                  No Volunteers Yet !
                </Text>
                <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
                  All Volunteers Will Appear Here
                </Text>
            </View>
        }
            <Toast ref={c => {this.toast = c;}} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  tabStyle: {
    backgroundColor: GLOBALS.primaryColor
  },
  innerContainer: {
    flex: 1,
    height: Dimensions.get('window').height*0.78,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})