import React from 'react'
import { View, ScrollView, ActivityIndicator} from 'react-native'

export default class DisplayOwned extends React.Component {
    constructor() {
        super()
        this.state = {
            loadeddata: false,
        }
    }
    render() {
        return (
            <View style={{flex: 1}}>
                { this.state.loadeddata ? 
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
                :
                <ActivityIndicator style={{position: 'absolute', left: -20, top: '45%'}}size="large" color="white"/>       
                }
            </View>
        )
    }
}