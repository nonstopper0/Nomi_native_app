import React from 'react'
import {View, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, AsyncStorage} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default class Settings extends React.Component {
    constructor() {
        super()
        this.state = {
            
        }
    }
    render() {
      return (
            <View style={styles.container}>
                <View>
                    <ScrollView indicatorStyle="white" style={{paddingTop: 20}}>
                        <TouchableOpacity onPress={()=> { this.props.logout()}}style={styles.item}>
                            <MaterialCommunityIcons color="orange" name="logout" size={32} />
                            <Text style={styles.text}>Logout</Text>
                        </TouchableOpacity>
                        <Text style={{color: 'grey', margin: 10, paddingTop: 10}}>This app is still within development stages, if you experience bugs please contact the owner at nathanielredmon@gmail.com</Text>
                    </ScrollView>
                </View>
            </View>
      )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: (Platform.OS === 'ios' ? 90 : 120), 
        backgroundColor: 'rgb(18,18,18)', 
        position: 'absolute', 
        flex: 1, 
        width: Dimensions.get('window').width, 
        height: Dimensions.get('screen').height, 
        zIndex: 3,
        alignItems: 'center'
    },
    item: {
        height: 60,
        flexDirection: 'row',
        width: Dimensions.get('window').width-20,
        backgroundColor: 'rgb(38,38,38)',
        borderRadius: 20,
        alignItems: 'center',
        padding: 10
    },
    text: {
        color: 'rgb(200,200,200)',
        fontSize: 30,
        fontWeight: 'bold'
    }
  });