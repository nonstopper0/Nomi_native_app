import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MenuDrawer from 'react-native-side-drawer'
import { AntDesign } from '@expo/vector-icons'

export default class DisplayOwnedStocks extends React.Component {
    constructor() {
        super()
        this.state = {
            open: false
        }
    }
    drawerContent = () => {
        return (
        <TouchableOpacity onPress={()=>this.setState({open: !this.state.open})} style={styles.animatedBox}>
            <Text>Close</Text>
        </TouchableOpacity>            
        )
    }
    render() {
        return (
          <View style={styles.container}>
            <MenuDrawer 
              open={this.state.open} 
              drawerContent={this.drawerContent()}
              drawerPercentage={45}
              animationTime={250}
              overlay={true}
              opacity={0.4}
            >
              <TouchableOpacity onPress={()=>this.setState({open: !this.state.open})} style={styles.container}>
                <AntDesign color="white" size={64} name="menuunfold"></AntDesign>
              </TouchableOpacity>
            </MenuDrawer>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        zIndex: 0
    },
    animatedBox: {
        flex: 1,
        backgroundColor: "#38C8EC",
        padding: 10
    },
  })