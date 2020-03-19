import React from 'react'
import { View, ScrollView, ActivityIndicator, Dimensions, ActionSheetIOS, ActivityIndicatorComponent, Text} from 'react-native'

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
            } else {
                console.log('no data')
            }
        } catch(err) {
            console.log(err)
        }
    }
    sell = async(id) => {
        try {
            const data = {
                id: id
            }
            const response = await fetch(`https://nomistockexpress.herokuapp.com/stock/sell`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const parsedResponse = await response.json()
            if (parsedResponse.status === 200) {
                const newState = this.state.data.filter((data) => {
                    return data.id !== id
                })
                this.props.add('add', parsedResponse.money)
                this.setState({
                    data: newState,
                    sellStockMessage: parsedResponse.data
                })
            } else {
                this.setState({
                    sellStockMessage: parsedResponse.data
                })
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
                        { this.state.isLoaded ? 
                        this.state.data.map((stock) => {
                            return (
                                <View key={stock.id} style={{flex: 1, alignItems: 'center', width: Dimensions.get("window").width, backgroundColor: 'rgb(38,38,38)', borderRadius: 20, marginBottom: 12}}>
                                    <Text>{stock.stock_name}</Text>
                                </View>
                            )
                        })
                        :
                        null
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }
}