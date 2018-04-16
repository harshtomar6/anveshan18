import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
  Container,
  Icon,
  Button,
  Content,
  Text,
  Footer,
  Spinner,
  FooterTab, Toast, ActionSheet, Tabs, Tab
} from 'native-base';
import AppBar from './../Components/header';
import About from './../Components/about';
import Volunteers from './../Components/volunteers';
import AdminHome from './../Components/adminHome';
import RecentActivity from './../Components/recentActivity';
import Participants from './../Components/Participants';
import EventsList from './../Components/events';
let GLOBALS = require('./../globals');

export default class HomeScreen extends React.Component {
  constructor(){
    super();
    this.tabView = null;
    this.isLoading = this.isLoading.bind(this);
    this.state = {
      tabs: [styles.active, styles.inactive, styles.inactive, styles.inactive, styles.inactive],
      tabsText: [styles.tabTextActive, styles.tabsTextInactive,
        styles.tabsTextInactive, styles.tabsTextInactive, styles.tabsTextInactive],
      appBarTitle: 'Anveshan - Admin',
      icon: 'more',
      isLoading: true,
      right: 'refresh',
      active: 0,
      refresh0: false,
      refresh1: false,
      refresh2: false,
      refresh3: false,
      noShadow: true
    }
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
          appBarTitle: 'Anveshan - Admin',
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
          icon: 'none',
          right: 'refresh',
          active: 1,
          noShadow: true
        });
        break;
      case 2:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.active, styles.inactive, styles.inactive],
          tabsText: [styles.tabsTextInactive, styles.tabsTextInactive,
            styles.tabTextActive, styles.tabsTextInactive, styles.tabsTextInactive],
          appBarTitle: 'People',
          icon: 'search',
          hasTabs: true,
          right: 'refresh',
          active: 2,
          noShadow: false
        });
        break;
      case 3:
        this.setState({
          tabs: [styles.inactive, styles.inactive, styles.inactive, styles.active, styles.inactive],
          tabsText: [styles.tabsTextInactive, styles.tabsTextInactive,
            styles.tabsTextInactive, styles.tabTextActive, styles.tabsTextInactive],
          appBarTitle: 'Recent Activity',
          icon: 'none',
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

  isLoading(data){
    this.setState({isLoading: data})
  }

  handleRefresh(e){
    switch(e){
      case 0:
        this.setState({refresh0: true});
        break;
      case 1:
        this.setState({refresh1: true});
        break;
      case 2:
        this.setState({refresh2: true});
        break;
      case 3:
        this.setState({refresh3: true});
        break;
      default:
        return
    }
  }

  render(){
    const { navigate } = this.props.navigation;
    let content=<Text></Text>;

    if (this.state.tabs[0] === styles.active)
      content = <Content><AdminHome navigation={this.props.navigation} refresh={this.state.refresh0}/></Content>

    if (this.state.tabs[1] === styles.active)
      content = <Content>
          <EventsList navigation={this.props.navigation} refresh={this.state.refresh1} type='admin'/>
        </Content>

    if (this.state.tabs[2] === styles.active)
      content= <Tabs>
                <Tab heading="Volunteers" tabStyle={styles.tabStyle}
                  activeTabStyle={styles.tabStyle}>
                  <Content>
                  <Volunteers navigation={this.props.navigation} 
                        refresh={this.state.refresh2} />
                  </Content>
                </Tab>
                <Tab heading="Participants" tabStyle={styles.tabStyle}
                  activeTabStyle={styles.tabStyle}>
                  <Content>
                    <Participants navigation={this.props.navigation} type='admin' refresh={this.state.refresh2}/>
                  </Content>
                </Tab>
              </Tabs>

    if(this.state.tabs[3] === styles.active)
      content= <Content><RecentActivity navigation={this.props.navigation} refresh={this.state.refresh3}/></Content>

    if (this.state.tabs[4] === styles.active)
      content = <Content><About /></Content>

    return(
      <Container>
        <AppBar title={this.state.appBarTitle} left='none' right={this.state.right}
         icon={this.state.icon} hasTabs={this.state.hasTabs} active={this.state.active}
         navigation = {this.props.navigation} refresh={(e) => this.handleRefresh(e)}
         noShadow={this.state.noShadow}/>

          {content}
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
            <Button vertical ref={2} onPress={() => this._handleTabTouch(2)}>
              <Icon name="people" style={this.state.tabs[2]}/>
              <Text style={this.state.tabsText[2]}>People</Text>
            </Button>
            <Button vertical ref={3} onPress={() => this._handleTabTouch(3)}>
              <Icon name="document" style={this.state.tabs[3]}/>
              <Text style={this.state.tabsText[3]}>Activity</Text>
            </Button>
            <Button vertical ref={4} onPress={() => this._handleTabTouch(4)}>
              <Icon name="information-circle" style={this.state.tabs[4]}/>
              <Text style={this.state.tabsText[4]}>About</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  tabStyle: {
    backgroundColor: GLOBALS.primaryColor,
    borderColor: '#fff'
  }
});
