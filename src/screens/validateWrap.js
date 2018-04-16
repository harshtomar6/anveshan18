import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Container, Text, Button, Content, Toast, Spinner} from 'native-base';
import AppBar from './../Components/header';
import { TextField } from 'react-native-material-textfield';
import QRCodeScanner from 'react-native-qrcode-scanner';
let config = require('./../config');
let GLOBALS = require('./../globals');

export default class ValidateWrap extends React.Component {

  constructor(){
    super();
    this.toast = null;
    this.qrCodeScanner = null;
    this.state = {
      participantId: '',
      data: [],
      isLoading: false,
      date: '',
      month: ''
    }
  }

  componentWillMount(){
    let date = new Date().getUTCDate();
    let month = new Date().getUTCMonth() + 1;

    this.setState({
      date: date,
      month: month
    })
  }

  handleSubmit(){
    if(this.state.participantId != ''){
      let upperId = this.state.participantId.toUpperCase();
      this.setState({isLoading: true})
    fetch(config.SERVER_URI+'/getParticipantDetails', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: upperId})
    })
      .then(res => {
        if(!res.ok){
          throw 'Error'
        }
        return res.json();
      })
      .then(res => {

        
        if(res.data === null){
          this.setState({isLoading: false})
          alert('Participant Not Found !')
        }
        else
          this.setState({data: res.data}, () => {
            this.setState({isLoading: false})

            this.props.navigation.navigate('participantDetails', {
              participantId: this.state.participantId.toUpperCase(),
              participantName: this.state.data.name,
              _id: this.state.data._id,
              eventsRegistered: this.state.data.eventsRegistered.length,
              eventsAttended: this.state.data.eventsAttended,
              type: this.props.navigation.state.params.type
            });

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
    else{
      alert('Please Enter Participant ID')
    }
  }

  handleScan(e){
    this.setState({participantId: e.data}, () => {
      this.handleSubmit();
    });
  }

  render(){
    let showSpinner = this.state.isLoading ? <Spinner color={GLOBALS.primaryColorDark}/>: <Text></Text>
    return (
      <Container>
        <AppBar title="Validate" navigation={this.props.navigation} left="arrow-back" />

        <Content style={{backgroundColor: '#fff'}}>
          {this.state.date >= 5 && this.state.month >= 2 ?
          <View style={styles.innerContainer}>
            <Text style={styles.info}>Enter Participant ID</Text>
            <TextField
                label='Participant ID'
                value={this.state.participantId}
                onChangeText={ (id) => this.setState({ participantId: id })}
                tintColor={GLOBALS.primaryColor} 
                maxLength={11}
              />
            <QRCodeScanner onRead={this.handleScan.bind(this)} ref={e => this.qrCodeScanner = e}
            />
            {showSpinner}
          </View>:
          <View style={styles.wrapContainer}>
            <Image source={require('./../sad.png')} style={{ width: 120, height: 120}}/>
              <Text style={{color: GLOBALS.primaryColorInactive, fontSize: 18}}>
                Wait Till The Big Day !
              </Text>
          </View>
          }
        </Content>

        {this.state.date >= 5 && this.state.month >= 2 ?
        <View style={{padding: 5, backgroundColor:'#fff'}}>
          <Button danger block onPress={this.handleSubmit.bind(this)}>
            <Text>Submit</Text>
          </Button>
        </View>:<Text></Text>}
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
  }
})