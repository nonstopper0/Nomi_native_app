import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, Platform} from 'react-native';
import DisplayStocks from './DisplayStocks.js'
import { MaterialIcons } from '@expo/vector-icons'
import LogRegister from './LogRegister'
import DisplayOwnedStocks from './DisplayOwnedStocks'

export default class App extends React.Component {

  // declare initial variables within state
  constructor() {
    super();
    this.state = { 
      logged: false,
      loggedID: 0, 
      money: 0,
      loadeddata: false
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: 'GET'
    })
    const parsedResponse = await response.json()
    if (parsedResponse.status === 200) {
      this.setState({
        loggedID: 0,
        logged: false
      })
    }
  }
  // we use this as a middle man between the update stocks and update history components. we do not want the history to load before the stock data is on the page
  updateHistory = (e) => {
    this.setState({
      loadeddata: true
    })
  }
  componentDidMount() {
    StatusBar.setBarStyle('light-content')
  }
  render() {
    return (
      <View style={styles.container}>
        { this.state.logged ? 
        <View>
          <View style={styles.header}>
            <View style={{left: -5, top: Platform.OS === 'ios' ? '50%' : '60%'}}>
              <Text style={{fontWeight: 'bold', fontSize: 25, color: 'white'}}><MaterialIcons name="attach-money" color="orange" size={25}/>{(this.state.money).toFixed(2)}</Text>
            </View>
          </View>
          <DisplayStocks subtract={this.updateMoney} loggedID={this.state.loggedID}></DisplayStocks>
        </View>
        : <LogRegister login={this.login} />
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
    zIndex: 2, 
    position: 'absolute', 
    width: '100%', 
    alignItems: 'center', 
    height: (Platform.OS === 'ios' ? 70 : 100),
    width: Dimensions.get('window').width, 
    backgroundColor: 'rgb(45,45,45)', 
    borderBottomColor: 'rgb(40,40,40)', 
    borderBottomWidth: 7   
  },
});
