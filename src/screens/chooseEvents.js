import React from 'react';
import { View, StyleSheet, ListView, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Body, Text, Button, Spinner, Toast, CheckBox, 
  Separator, Left, List, ListItem, Right, Footer, Icon } from 'native-base';
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
        this.setState({isLoading: false})
        if(!res.ok){
          if(this.toast !== null)
          return this.toast._root.showToast({config: {
            text: JSON.parse(res._bodyText).err,
            position: 'bottom',
            buttonText: 'Okay',
            duration: 3000,
            style: {
               backgroundColor: GLOBALS.primaryErrColor
            }
          }})
        }
        GLOBALS.events = JSON.parse(res._bodyText).data
        this.setState({data: JSON.parse(res._bodyText).data}, () => {
          this.categorizeData(this.state.data)
        })
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

  handleCheck(_id, name){
    let selected = this.state.selected;
    let price = this.state.totalPrice;
    let data = this.state.data;

    if(selected.includes(name)){
      selected.splice(selected.indexOf(name), 1)
    }
    else{
      selected.push(name)
    }

    
    this.setState({selected});
  }

  handleSubmit(){
    if(this.state.selected.length === 0)
      return this.toast._root.showToast({config: {
        text: 'Atleast 1 Event must be selected !',
        position: 'bottom',
        buttonText: 'Okay',
        duration: 3000,
        style: {
          backgroundColor: GLOBALS.primaryErrColor
        }
      }})
    else{
      const { navigate } = this.props.navigation;
      navigate('reviewSell', {
        name: this.props.navigation.state.params.name,
        email: this.props.navigation.state.params.email,
        phone: this.props.navigation.state.params.phone,
        college: this.props.navigation.state.params.college,
        events: this.state.selected,
        price: this.state.totalPrice
      });
    }
  }

  render(){
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      });
    
    let list = <View>
      <ListView
        dataSource={ds.cloneWithRows(this.state.data)}
        renderRow={
        (item) => <ListItem avatar button onPress={() => {this.handleCheck(item._id, name)}}>
                      <Left style={{marginRight: 20, marginLeft: -10}}>
                        <CheckBox color={GLOBALS.primaryColor} 
                          checked={this.state.selected.includes(item._id) ? true : false}
                          onPress={() => this.handleCheck(item._id, item.name)}/>
                      </Left>
                      <Body style={{marginLeft: 10}}>
                        <Text>{item.name}</Text>
                        <Text note>First Prize: &#8377;&nbsp;{item.prize.first}</Text>
                        <Text note>Second Prize: &#8377;&nbsp;{item.prize.second}</Text>
                      </Body>
                      <Right>
                        <Button small danger onPress={() => this.handlePress(item._id, item.name)}>
                          <Text>More</Text>
                        </Button>
                      </Right>
                    </ListItem>
        }
        />
    </View>
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: list
    
    return (
      <Container>
        <AppBar title='Pick Events' left='arrow-back' navigation={this.props.navigation} />
    
        <Content>
          <View style={{flex: 1, backgroundColor: '#fff'}}>
          {showSpinner}
          </View>
          <View style={{backgroundColor: '#fff', height: this.state.isLoading ? 0 : 80 }}></View>
        </Content>
          <View style={styles.footer}>
            <View style={{paddingTop: 5, paddingBottom: 5}}>
            <Text style={styles.footerTitle}>
              SELECTED: &nbsp;&nbsp;{this.state.selected.length}
            </Text>
            </View>
            <Button transparent small style={{padding: 0}} onPress={this.handleSubmit.bind(this)}>
            <Icon name="arrow-forward" style={{color: '#fff', fontSize: 18}} />
            </Button>
          </View>
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
  },
  card: {
    borderRadius: 10,
    backgroundColor: GLOBALS.primaryColor,
    margin: 10,
    width: Dimensions.get('window').width/2,
    padding: 20
  }
});