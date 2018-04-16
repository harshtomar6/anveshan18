import React from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, InteractionManager } from 'react-native';
import { Text, Card, CardItem, Spinner, List, ListItem, Left, Thumbnail,
  Body, Right, Icon, Label, Toast, Button } from 'native-base';
let GLOBALS = require('./../globals');
const config = require('./../config');

export default class AdminHome extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this);
    this.scrollView = null;
    this.state = {
      data: [],
      isLoading: false,
      errLoading: false,
      swiper: [
        {
          text: 'ONE'
        },
        {
          text: 'TWO'
        },
        {
          text: 'THREE'
        }
      ]
    };
  }

  componentWillMount(){
    if(GLOBALS.recentActivity.hasOwnProperty('summary')){
      this.setState({data: GLOBALS.recentActivity})
      //this.props.isLoading(false)
    }
    else{
      this.fetchData()
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.refresh){
      this.fetchData();
    }
  }

  fetchData(){
    this.setState({isLoading: true})
      fetch(config.SERVER_URI+'/getHomeData')
        .then(res => {
          if(!res.ok){
            throw Error(res.statusText);
          }
          return res.json()
        })
        .then(res => {
          GLOBALS.recentActivity = res.data
          this.setState({data: res.data}, () => {
            this.setState({isLoading: false})
          })
          //this.props.isLoading(false)
        })
        .catch(err => {
          this.setState({isLoading: false, errLoading: true})
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

  getRecentActivityIcon(type){
    let icon = '';

    switch(type){
      case 'REGISTER':
        icon = require('./../volunteer-thumbnail.png');
        break;
      case 'PASS_SOLD':
        icon = require('./../dollarIcon.png');
        break;
      case 'LOGIN':
        icon = require('./../login.png');
        break;
      case 'LOGOUT':
        icon = require('./../logout.png');
        break;
      case 'MONEY_COLLECT':
        icon = require('./../dollarIcon2.png');
        break;
      default:
        icon = require('./../7.png');
    }

    return icon;
  }

  activityPress(volunteerId, volunteerName, passesSold){
    const { navigate } = this.props.navigation;
    if(volunteerId === 'admin'){}
    
    else
      navigate('volunteerDetails', {
        volunteerId,
        volunteerName
      })
  }

  validate(){
    const { navigate } = this.props.navigation;
    navigate('validateWrap', {type: 'admin'});
  }

  render(){

    let summary = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} /> :
      this.state.errLoading ? <Text>Err Loading</Text>:
      <Body>
        <Label>Total Collection</Label>
        <Text style={styles.info}>&#8377;&nbsp;{this.state.data.summary.totalCollection}</Text>
        <Label>Total Amount Collected</Label>
        <Text style={styles.info}>&#8377;&nbsp;{this.state.data.summary.amountCollected}</Text>
        <Label>Total Amount Pending</Label>
        <Text style={styles.info}>&#8377;&nbsp;{this.state.data.summary.totalCollection - this.state.data.summary.amountCollected}</Text>
        <Label>Total Passes Sold</Label>
        <Text style={styles.info}>{this.state.data.summary.totalPassesSold}</Text>
        <Label>Total Volunteers Registered</Label>
        <Text style={styles.info}>{this.state.data.summary.totalVolunteersRegistered}</Text>
        <Label>Total Participants Registered</Label>
        <Text style={styles.info}>{this.state.data.summary.totalParticipants}</Text>
      </Body>

    let recentActivity = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />:
      this.state.errLoading ? <Text>Err Loading</Text>:
      <List dataArray={this.state.data.recentActivity}
        renderRow={(item) =>
          <ListItem button avatar
            onPress={() => this.activityPress(item.owner.id, item.owner.name)}>
            <Left>
              <Thumbnail style={{width: 45, height: 45}} source={this.getRecentActivityIcon(item.type)} />
            </Left>
            <Body>
              <Text>{item.description}</Text>
              <Text note>{new Date(item.time).toDateString()},&nbsp;
                {new Date(item.time).toTimeString().split('GMT')[0]}
              </Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        }></List>
    return (
      <View style={styles.container}>
        <View style={{backgroundColor:'#fff', height: Dimensions.get('window').height*0.3}}>
          <ScrollView ref='_scrollView'
              horizontal
              pagingEnabled
              scrollEventThrottle={10}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.slide1}>
                <Text style={styles.bannerText}>Total Collection</Text>
                <Text style={styles.bannerText}>
                &#8377;&nbsp;{this.state.isLoading ? '-' : this.state.data.summary.totalCollection}
                </Text>
              </View>
              <View style={styles.slide2}>
              <Text style={styles.bannerText}>Total Participants</Text>
                <Text style={styles.bannerText}>
                  {this.state.isLoading ? '-' : this.state.data.summary.totalParticipants}
                </Text>
              </View>
              <View style={styles.slide3}>
                <Text style={styles.bannerText}>Total Volunteers</Text>
                <Text style={styles.bannerText}>
                  {this.state.isLoading ? '-' : this.state.data.summary.totalVolunteersRegistered}
                </Text>
              </View>
              <View style={styles.slide3}>
                <Text style={styles.bannerText}>Total Passes Sold</Text>
                <Text style={styles.bannerText}>
                  {this.state.isLoading ? '-' : this.state.data.summary.totalPassesSold}
                </Text>
              </View>
            </ScrollView>
        </View>
        <Card>
          <CardItem header>
            <Text style={{color: GLOBALS.primaryColorDark, fontWeight: '500'}}>SUMMARY</Text>
          </CardItem>
          <CardItem>
            {summary}
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text style={{color: GLOBALS.primaryColorDark, fontWeight: '500'}}>RECENT ACTIVITY</Text>
          </CardItem>
          <CardItem style={{flex: 1}}>
            {recentActivity}
          </CardItem>
        </Card>
        <Card>
          <CardItem header>
            <Text style={{color: GLOBALS.primaryColorDark}}>ACTIONS</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Button block danger onPress={this.validate.bind(this)}>
                <Text>Validate participant</Text>
              </Button>
            </Body>
          </CardItem>
        </Card>
        <Toast ref={(c) => {this.toast = c}} />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  swiper: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 70,
    backgroundColor: '#fff'
  },
  banner: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 70,
    backgroundColor: GLOBALS.primaryColor
  },
  bannerText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '800'
  },
  info: {
    fontSize: 18,
    margin: 10,
    color: GLOBALS.primaryColorDark,
    fontWeight: '600'
  },
  slide1: {
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GLOBALS.primaryColor,
  },
  slide2: {
    flex: 1,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GLOBALS.primaryColor,
  },
  slide3: {
    flex: 1,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GLOBALS.primaryColor,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  iconForward: {
    color: '#fff'
  }
})
