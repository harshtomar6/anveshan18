import React from 'react';
import { View, Stylesheet, StyleSheet } from 'react-native';
import {
  Container,
  Icon,
  Button,
  Content,
  Text,
  Footer,
  Spinner,
  FooterTab,
  Toast, ActionSheet
} from 'native-base';
import AppBar from './../Components/header';
import SellPass from './../Components/sellPass';
import Participants from './../Components/Participants';
import VolunteerHome from './../Components/volunteerHome';
import EventsList from './../Components/events';
import About from './../Components/about';
let GLOBALS = require('./../globals');

export default class VolunteerScreen extends React.Component {

  constructor(){
    super();
    this.state = {
      appBarTitle: 'Anveshan 18',
      tabs: [styles.active, styles.inactive, styles.inactive, styles.inactive, styles.inactive],
      tabsText: [styles.tabTextActive, styles.tabsTextInactive,
        styles.tabsTextInactive, styles.tabsTextInactive, styles.tabsTextInactive],
      icon: 'more',
      right: 'refresh',
      active: 0,
      noShadow: true,
      refresh0: false,
      refresh1: false,
      refresh3: false
    }
  }

  componentWillUnmount(){
    Toast.toastInstance = null;
    ActionSheet.actionsheetInstance = null;
  }

  _handleTabTouch(e){
    this.updateTabStyle(e)
  }

  updateTabStyle(ref){
    switch(ref){
      case 0:
        this.setState({
          tabs: [styles.active, styles.inactive, styles.inactive, styles.inactive, styles.inactive],
          tabsText: [styles.tabTextActive, styles.tabsTextInactive,
            styles.tabsTextInactive, styles.tabsTextInactive, styles.tabsTextInactive],
          appBarTitle: 'Anveshan 18',
          icon: 'more',
          right: 'refresh',
          active: 0,
          noShadow: true
        });
        break;
      case 1:
        this.setState({
          tabs: [styles.inactive, styles.active, styles.inactive, styles.inactive, styles.inactive],
          tabsText: [styles.tabsTextInactive, styles.tabTextActive,
            styles.tabsTextInactive, styles.tabsTextInactive, styles.tabsTextInactive],
          appBarTitle: 'Events',
          right: 'refresh',
          icon: 'none',
          active: 1,
          noShadow: true
        });
        break;
      case 2:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.active, styles.inactive, styles.inactive],
          tabsText: [styles.tabsTextInactive, styles.tabsTextInactive,
            styles.tabTextActive, styles.tabsTextInactive, styles.tabsTextInactive],
          appBarTitle: 'Sell Pass',
          icon: 'none',
          right: 'none',
          active: 2,
          noShadow: false
        });
        break;
      case 3:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.inactive, styles.active, styles.inactive],
          tabsText: [styles.tabsTextInactive, styles.tabsTextInactive,
            styles.tabsTextInactive, styles.tabTextActive, styles.tabsTextInactive],
          appBarTitle: 'Participants',
          icon: 'search',
          right: 'refresh',
          active: 3,
          noShadow: false
        })
        break;
      case 4:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.inactive, styles.inactive, styles.active],
          tabsText: [styles.tabsTextInactive, styles.tabsTextInactive,
            styles.tabsTextInactive, styles.tabsTextInactive, styles.tabTextActive],
          appBarTitle: 'About',
          icon: 'none',
          right: 'none',
          active: 4,
          noShadow: false
        })
    }
  }

  handleRefresh(e){
    switch(e){
      case 0:
        this.setState({refresh0: true});
        break;
      case 1:
        this.setState({refresh1: true});
        break;
      case 3:
        this.setState({refresh3: true});
        break;
      default:
        return
    }
  }

  render(){
    let content=<Text></Text>;

    if (this.state.tabs[0] === styles.active)
      content = <VolunteerHome handleNav={(e) => {this.updateTabStyle(e)}} refresh={this.state.refresh0}
        navigation={this.props.navigation}/>

    if (this.state.tabs[1] === styles.active)
      content = <Content><EventsList navigation={this.props.navigation} refresh={this.state.refresh1}/></Content>

    if (this.state.tabs[2] === styles.active)
      content = <SellPass navigation={this.props.navigation}/>

    if (this.state.tabs[3] === styles.active)
      content= <Participants navigation={this.props.navigation} refresh={this.state.refresh3}/>

    if(this.state.tabs[4] === styles.active)
      content= <About />

    return (
      <Container>
        <AppBar title={this.state.appBarTitle} icon={this.state.icon} right={this.state.right} left='none'
          navigation={this.props.navigation} noShadow={this.state.noShadow} active={this.state.active}
          refresh={(e) => this.handleRefresh(e)}/>
        <Content>
          {content}
        </Content>
        <Footer style={{borderTopColor: GLOBALS.primaryColorInactive, borderTopWidth: 0.2}}>
          <FooterTab style={styles.tabs}>
            <Button vertical ref={0} onPress={() => this._handleTabTouch(0)}>
              <Icon name="home" style={this.state.tabs[0]}/>
              <Text style={this.state.tabsText[0]}>Home</Text>
            </Button>
            <Button vertical ref={1} onPress={() => this._handleTabTouch(1)}>
              <Icon name="apps" style={this.state.tabs[1]}/>
              <Text style={this.state.tabsText[1]}>Events</Text>
            </Button>
            <Button vertical
              ref={2} onPress={() => this._handleTabTouch(2)}>
              <Icon name="create" style={this.state.tabs[2]}/>
              <Text style={this.state.tabsText[2]}>Sell</Text>
            </Button>
            <Button vertical ref={3} onPress={() => this._handleTabTouch(3)}>
              <Icon name="people" style={this.state.tabs[3]}/>
              <Text style={this.state.tabsText[3]}>Partici...</Text>
            </Button>
            <Button vertical ref={4} onPress={() => this._handleTabTouch(4)}>
              <Icon name="information-circle" style={this.state.tabs[4]}/>
              <Text style={this.state.tabsText[4]}>About</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container:{

  },
  tabs: {
    backgroundColor: '#fff'
  },
  active: {
    fontSize: 28,
    color: GLOBALS.primaryColorDark
  },
  inactive: {
    color: GLOBALS.primaryColorInactive
  },
  tabTextActive: {
    fontSize: 7.6,
    color: GLOBALS.primaryColorDark
  },
  tabsTextInactive: {
    fontSize: 7.6,
    color: GLOBALS.primaryColorInactive
  },
  centeractive: {
    color: '#fff'
  },
  centerinactive: {
    color: '#fff',
  }
})
