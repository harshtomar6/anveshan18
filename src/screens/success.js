import React from 'react';
import { Animated, View, StyleSheet, Image, Dimensions } from 'react-native';
import { Container, Content, Text, Button} from 'native-base';
import AppBar from './../Components/header';
import { NavigationActions } from 'react-navigation';
let GLOBALS = require('./../globals');

export default class Success extends React.Component {

  constructor(){
    super();
    this.state = {
      scale: new Animated.Value(10),
      opacity: new Animated.Value(0)
    }
  }

  componentDidMount(){
    Animated.timing(
      this.state.scale,
      {
        toValue: 1,
        duration: 500
      }
    ).start()

    Animated.timing(
      this.state.opacity,
      {
        toValue: 1,
        duration: 600
      }
    ).start()
  }

  handlePress(){
    const goToHome = NavigationActions.reset({
      index:  0,
      actions: [
        NavigationActions.navigate({routeName: 'Volunteer'})
      ]
    });

    this.props.navigation.dispatch(goToHome);
  }

  render(){
    const opacity = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })

    const scale = this.state.scale.interpolate({
      inputRange: [0, 1],
      outputRange: [5, 1]
    })

    return (
      <Container>
        <AppBar title="Sell Pass" navigation={this.props.navigation} left="none" />
        <Content style={{backgroundColor: '#fff'}}>
          <View style={styles.container}>
            <Animated.Image source={require('./../sold2.png')} 
              style={{width: '100%', height: 220, resizeMode: 'contain', transform: [{scale}], opacity}}/>
          </View>
        </Content>
        <View style={{padding: 5, backgroundColor: '#fff'}}>
          <Button block danger onPress={this.handlePress.bind(this)}> 
            <Text>Go to Home</Text>
          </Button>
        </View>
      </Container>
    );
  }

}

const styles={
  container: {
    flex: 1,
    height: Dimensions.get('window').height*0.78,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
}