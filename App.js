import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, Platform, AsyncStorage, TouchableOpacity} from 'react-native';
import DisplayStocks from './DisplayStocks.js'
import { MaterialIcons } from '@expo/vector-icons'
import LogRegister from './LogRegister'
import DisplayOwned from './DisplayOwned'
import Settings from './Settings'

export default class App extends React.Component {

  // declare initial variables within state
  constructor() {
    super();
    this.state = { 
      logged: false,
      loggedID: 0, 
      money: 0,
      loadeddata: false,
      homepage: true,
      settings: false,
    };
  }

  // this function is called from props passed down to the LogRegister component, it makes sure our entire app scope knows who we are, and if we are logged in.
  login = (id, money) => {
    this.setState({
      logged: true,
      loggedID: id,
      money: money
    })
  }

  // updating money on the front end (back-end money is still persisnt no matter what number is shown here) so that the user can see what they have left
  updateMoney = (subtract, money) => {
    if (subtract == 'subtract') {
      this.setState({
        money: this.state.money - money
      })
    } else {
      this.setState({
        money: this.state.money + money
      })
    }
  }

  // this function is called from the menu listed downbelow, it logs us out on both the front and back-end.
  logout = async(e) => {
      const response = await fetch(`https://nomistockexpress.herokuapp.com/logout`, {
        method: 'GET'
    })
    const parsedResponse = await response.json()
    if (parsedResponse.status === 200) {
      AsyncStorage.removeItem('1')
      AsyncStorage.removeItem('2')
      this.setState({
        loggedID: 0,
        logged: false,
        settings: false,
        homepage: true,
        money: 0,
        loadeddata: false,
      })
    }
  }
  // we use this as a middle man between the update stocks and update history components. we do not want the history to load before the stock data is on the page
  updateHistory = (e) => {
    this.setState({
      loadeddata: true
    })
  }
  // turn the status bar white to contrast with the dark background on app load
  componentDidMount = (e) => {
    StatusBar.setBarStyle('light-content', true);
  }
  render() {
    return (
      <View style={styles.container}>
        { this.state.logged ? 
        <View>
            {/* header */}
            <View style={styles.header}>  
              {/* button that triggers the owned stocks menu */}
              <TouchableOpacity onPress={()=>this.setState({homepage: !this.state.homepage})} style={{position: 'absolute', left: 10, top: Platform.OS === 'ios' ? '50%' : '60%'}}>
                <MaterialIcons name={this.state.homepage ? 'expand-more' : 'expand-less'} color={!this.state.homepage ? 'grey' : 'white'} size={32}/>
              </TouchableOpacity>
              {/* money display */}
              <View style={{left: -5, top: Platform.OS === 'ios' ? '50%' : '60%'}}>
                <Text style={{fontWeight: 'bold', fontSize: 25, color: 'white'}}><MaterialIcons name="attach-money" color="orange" size={25}/>{(this.state.money).toFixed(2)}</Text>
              </View>
              {/* button that triggers the settings menu */}
              <TouchableOpacity onPress={()=>this.setState({settings: !this.state.settings})} style={{position: 'absolute', left: Dimensions.get('screen').width - 50, top: Platform.OS === 'ios' ? '50%' : '60%'}}>
                <MaterialIcons name='settings' color={this.state.settings ? 'grey' : 'white'} size={32}/>
              </TouchableOpacity>
            </View>
            {/* menu triggers */}
            { this.state.homepage ? null : <DisplayOwned add={this.updateMoney} loggedID={this.state.loggedID}/> }
            { this.state.settings ? <Settings logout={this.logout}/> : null }
            {/* main stock component */}
            <DisplayStocks subtract={this.updateMoney} loggedID={this.state.loggedID}/>
        </View>
        : 
        <LogRegister login={this.login} />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(18,18,18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    zIndex: 4, 
    position: 'absolute', 
    alignItems: 'center', 
    height: (Platform.OS === 'ios' ? 90 : 120),
    width: Dimensions.get('window').width, 
    backgroundColor: 'rgb(45,45,45)', 
    borderBottomColor: 'rgb(40,40,40)', 
    borderBottomWidth: 7   
  },
});
