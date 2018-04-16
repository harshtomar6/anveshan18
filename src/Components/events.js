import React from 'react';
import { View ,StyleSheet, ListView} from 'react-native';
import { List, ListItem ,Separator, Text, Spinner, Toast, Left, Body, Thumbnail, Right, Icon} from 'native-base';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class EventsList extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.fetchData = this.fetchData.bind(this);
    this.state = {
      isLoading: false,
      data: [],
    }
  }

  componentWillMount(){
    if(GLOBALS.events.length > 0){
      this.setState({data: GLOBALS.events});
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

  render(){
    
    let list2 = <View>
      <List
        dataArray={this.state.data}
        renderRow={
        (item) => <ListItem button avatar
                      onPress={() => this.handlePress(item._id, item.name)}>
                      <Left>
                        <Thumbnail style={{width: 45, height: 45}} source={require('./../7.png')} />
                      </Left>
                      <Body>
                        <Text>{item.name}</Text>
                        <Text note>First Prize: &#8377;&nbsp;{item.prize.first}</Text>
                        <Text note>Second Prize: &#8377;&nbsp;{item.prize.second}</Text>
                      </Body>
                      <Right>
                        <Icon name="arrow-forward"></Icon>
                      </Right>
                    </ListItem>
        }
        />
    </View>
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark} />: list2
    return (
      <View style={styles.container}>

        <View style={styles.miniContainer}>
          <Text style={{color: '#fff', fontWeight: '800', fontSize: 22}}>Total Events: {this.state.data.length > 0 ? this.state.data.length: '-'}</Text>
        </View>
        {showSpinner}
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
  miniContainer: {
    backgroundColor: GLOBALS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    paddingTop: 20,
  },
  title: {
    color: GLOBALS.primaryColor,
    margin: 10,
    fontSize: 14
  }
});
