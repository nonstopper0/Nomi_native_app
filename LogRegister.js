import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, Platform, Keyboard, AsyncStorage} from 'react-native';

export default class LogRegister extends React.Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            email: '',
            action: 'login',
            message: ''
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        if (this.state.action === 'login') {
            this.login({
                username: this.state.username.toLowerCase(),
                password: this.state.password,
            })
        } else if (this.state.action === "register") {
            this.register({
                username: this.state.username.toLowerCase(),
                password: this.state.password,
                email: this.state.email.toLowerCase(),
            })
        }
    }
    register = async (info) => {
        const response = await fetch(`https://nomistockexpress.herokuapp.com/register`, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: {
                'Content-Type': 'application/json'
            }
        }) 
        const parsedRegisterResponse = await response.json() 
        if (parsedRegisterResponse.status === 200) {
            this.props.login(parsedRegisterResponse.data, parsedRegisterResponse.money)
        } else {
            this.setState({
                message: 'Register failed, Username or email already taken'
            })
        }
    }
    login = async (info) => {
        const response = await fetch(`https://nomistockexpress.herokuapp.com/login`, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const parsedLoginResponse = await response.json()
        if (parsedLoginResponse.status === 200) {
            this.props.login(parsedLoginResponse.data, parsedLoginResponse.money)
            if (this.state.username && this.state.password) {
                await AsyncStorage.setItem('1', `${this.state.username}`)
                await AsyncStorage.setItem('2', `${this.state.password}`)
            }
        } else {
            this.setState({
                message: 'Login failed, Wrong username or password'
            })
        }
    }
    changeAction = (e) => {
        if (this.state.action === "login") {
            this.setState({
                action: "register",
                message: ''
            })
        } else {
            this.setState({
                action: "login",
                message: ''
            })
        }
    }
    componentDidMount = async(e) => {
        const username = await AsyncStorage.getItem('1')
        const password = await AsyncStorage.getItem('2')
        if (username && password != null) {
            console.log(username, password)
            this.login({username: username.toLowerCase(), password: password})
        }
    }
    // check async storage to see if the user has already logged in on this device
    render(){
        return(
            <View style={{flex: 0, width: '90%', justifyContent: "center", backgroundColor: 'rgb(48,48,48)', borderRadius: 25}}>
                {this.state.message ? 
                Alert.alert(
                    'Wrong Username or Password',
                    'Please try again',
                    [{text: 'OK', onPress: () => this.setState({message: ''})}],
                    {cancelable: false},
                  )
                : null }
                <View style={{margin: 10}}>
                    <Text style={{fontWeight: 'bold', textAlign: 'center', color: 'white', fontSize: 25, margin: 10}}><Text style={{color: 'orange'}}>NOMI</Text> Login</Text>
                    <View style={{ margin: 5, backgroundColor: 'rgb(38,38,38)'}}>
                        <Button onPress={this.changeAction} color={Platform.OS === "ios" ? "white" : "rgb(38,38,38)" }title={this.state.action === "login" ? "Not a user? Register here" : "Already a user, Login here"}></Button>
                    </View>
                    <TextInput 
                        value={this.state.username}
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="gray"
                        onChangeText={(text) => this.setState({username: text})}
                        />
                    { this.state.action === "login" ? null : 
                        <TextInput
                        onBlur={Keyboard.dismiss}
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        value={this.state.email}
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="gray"
                        onChangeText={(text) => this.setState({email: text})}
                        />}
                    <TextInput
                        onBlur={Keyboard.dismiss}
                        autoCapitalize="none"
                        textContentType="password"
                        value={this.state.password}
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="gray"
                        onChangeText={(text) => this.setState({password: text})}
                        onSubmitEditing={this.handleSubmit}
                        />
                    <View style={{ margin: 5}}>
                    <Button onPress={this.handleSubmit} color="orange" title={this.state.action === "login" ? "Login" : "Register"}></Button>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        height: 45, 
        color: 'white', 
        backgroundColor: 'rgb(38,38,38)', 
        padding: 10, 
        margin: 5, 
    }
})