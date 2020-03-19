import React from 'react'
import {View, Dimensions, ScrollView } from 'react-native'

export default class Settings extends React.Component {
    constructor() {
        super()
        this.state = {
            
        }
    }
    render() {
      return (
<View style={{backgroundColor: 'rgb(18,18,18)', position: 'absolute', flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('screen').height, zIndex: 3}}>
                <View>
                    <ScrollView indicatorStyle="white">
                        <View style={{
                            flex: 1, 
                            alignItems: 'center', 
                            flexDirection:'row', 
                            zIndex: 1, 
                            width: '100%', 
                            borderRadius: 20, 
                            backgroundColor: 'rgb(38,38,38)', 
                            marginTop: (Platform.OS === 'ios' ? 100 : 130),
                            marginBottom: 12,
                            justifyContent: 'space-evenly'
                            }}
                        >

                        </View>
                    </ScrollView>
                </View>
            </View>
      )
    }
}