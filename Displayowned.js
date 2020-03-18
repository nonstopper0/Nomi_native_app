import React from 'react'
import { View, ScrollView, ActivityIndicator, Dimensions} from 'react-native'

export default class DisplayOwned extends React.Component {
    constructor() {
        super()
        this.state = {
            loadeddata: false,
            data: [],
            isLoaded: true,
        }
    }
    updateOwned = async() => {
        try {
            const response = await fetch(`https://nomistockexpress.herokuapp.com/stock/history/${this.props.loggedID}`, {
                method: 'GET' 
            })
            const parsedResponse = await response.json()
            if (parsedResponse.status == 200) {
                this.setState({
                    data: parsedResponse.data,
                    isLoaded: true,
                }) 
                console.log(parsedResponse.data)              
            } else {
                console.log('no data')
            }
        } catch(err) {
            console.log(err)
        }
    }
    componentDidMount() {
        this.updateOwned()
    }
    render() {
        return (
            <View style={{position: 'absolute', flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height, zIndex: 3}}>
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