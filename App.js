import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput} from 'react-native';
import Fetch from './Fetch.js'
import LogRegister from './LogRegister'

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
  render() {
    return (
      <View style={styles.container}>
        { this.state.logged ? 
        <Fetch loggedID={this.state.loggedID}></Fetch>
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
    backgroundColor: 'rgb(28,28,28)', 
    padding: 20
  }
});
