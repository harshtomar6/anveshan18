import React from 'react';
import { View, StyleSheet, Dimensions, Image, BackHandler } from 'react-native';
import { Container, Text, Button, Content, Toast, Spinner} from 'native-base';
import AppBar from './../Components/header';
import { TextField } from 'react-native-material-textfield';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class CollectMoney extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.state = {
      amount: '',
      data: [],
      remainingAmount: 0,
      isLoading: false,
      collected: false
    }
  }

  componentWillMount(){
    this.setState({
      remainingAmount: this.props.navigation.state.params.totalMoney
    })
   // BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount(){
    
  }

  handleSubmit(){
    if(this.state.amount > 0 && this.state.amount <= this.state.remainingAmount){
      if(!this.state.isLoading){
        this.setState({isLoading: true})
        fetch(config.SERVER_URI+'/collectMoney', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: this.props.navigation.state.params.id, amount: this.state.amount})
        })
        .then(res => {
          if(!res.ok){
            throw Error(res.statusText);
          }
          return res.json()
        })
        .then(res => {
          GLOBALS.socket.emit('record-activity', {
            type: 'MONEY_COLLECT',
            owner: {
              id: this.props.navigation.state.params.id,
              name: this.props.navigation.state.params.name,
              amount: this.state.amount
            }
          })

          this.setState({remainingAmount: this.state.remainingAmount-this.state.amount}, () => {
            this.setState({isLoading: false, collected: true});
          });
          alert('Money Collected');
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
      }else{
        alert('Your request is being processed');
      }
    }
    else{
      alert('Please enter valid amount');
    }
  }

  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <Container>
        <AppBar title="Collect Money" navigation={this.props.navigation} left="arrow-back" />

        <Content style={{backgroundColor: '#fff'}}>
          <View style={styles.innerContainer}>
            <Text style={styles.info}>Enter Amount</Text>
            <TextField
                label='Amount'
                value={this.state.amount}
                onChangeText={ (id) => this.setState({ amount: id })}
                tintColor={GLOBALS.primaryColor} 
                maxLength={10}
                keyboardType='Numeric'
              />
            {showSpinner}

          </View>
        </Content>

        <View style={{padding: 5, backgroundColor:'#fff'}}>
          <Button danger block onPress={this.handleSubmit.bind(this)}>
            <Text>Collect</Text>
          </Button>
        </View>

        <Toast ref={c => this.toast =c} />
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    height: Dimensions.get('window').height*0.78,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 30
  },
  info: {
    fontSize: 18,
    color: GLOBALS.primaryColor,
  },
  wrapContainer: {
    flex: 1,
    height: Dimensions.get('window').height*0.78,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})