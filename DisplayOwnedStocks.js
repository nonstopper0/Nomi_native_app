import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
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
              <TouchableOpacity onPress={()=> this.setState({open: !this.state.open})} style={styles.button}>
                <AntDesign color="white" size={29} name="menuunfold"></AntDesign>
              </TouchableOpacity>
            <MenuDrawer 
              open={this.state.open} 
              drawerContent={this.drawerContent()}
              drawerPercentage={50}
              animationTime={250}
              overlay={true}
              opacity={.5}
            >
            </MenuDrawer>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        zIndex: 1,
    },
    button: {
        position: 'relative', 
        top: 0,
        width: 40,
        height: 40,
        zIndex: 1,
        left: -Dimensions.get("window").width / 2 + 20,
    },
    animatedBox: {
      flex: 1,
      left: -Dimensions.get("window").width / 2,
      backgroundColor: "#38C8EC",
      padding: 10
    },
  })