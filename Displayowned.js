import React from 'react'
import { View, ScrollView, ActivityIndicator, Dimensions, ActionSheetIOS, ActivityIndicatorComponent, Text, TouchableOpacity} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
                if (parsedResponse.data.length > 0) {
                    this.setState({
                        data: parsedResponse.data,
                        isLoaded: true,
                    })             
                } 
            } else if (parsedResponse.status == 400) {
                this.setState({
                    message: 'there has been an error fetching the stocks'
                })
            }
        } catch(err) {
            console.log(err)
        }
        console.log(this.state.data)
    }
    sell = async(id) => {
        console.log('selling')
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
                    message: 'succesfully sold stock'
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
                        { this.state.message ? 
                        <Text style={{fontSize: 20, color:'white', textAlign:'center', margin: 20}}>{this.state.message}</Text>
                        :
                        null
                        }
                        { this.state.isLoaded ? 
                        this.state.data.map((stock) => {
                            if(stock.isOwned) {
                                return (
                                    <View key={stock.id} style={{flex: 1, padding: 20, flexDirection: 'column', width: Dimensions.get("window").width-20, alignSelf: 'center', backgroundColor: 'rgb(38,38,38)', borderRadius: 20, marginBottom: 12}}>
                                        <View style={{flex: 1, flexDirection: 'row'}}>
                                            <Text style={{fontSize: 40, color: 'orange', fontWeight: '600'}}>{stock.stock_name}</Text>
                                        </View>
                                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{position: 'absolute', left: Dimensions.get('window').width-150, top: -50, flexDirection: 'row', alignItems: 'center', borderRadius: 10, width: 90, height: 32, backgroundColor: stock.current_price > stock.buy_price ? 'green' : 'red'}}>
                                                <MaterialCommunityIcons color="white" name={stock.current_price > stock.buy_price ? 'plus' : 'minus'} size={32}></MaterialCommunityIcons>
                                                <Text style={{color: 'white', fontSize: 16}}>{`%${(((stock.current_price - stock.buy_price) / stock.buy_price)*100).toFixed(1)}`}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{fontSize: 20, color: 'white'}}>{stock.current_price}</Text>
                                        </View>
                                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{fontSize: 16, color: 'white'}}>quantity: {stock.quantity}</Text>
                                        </View>
                                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{fontSize: 16, color: 'white'}}>purchased on <Text style={{fontWeight:'bold'}}>{(stock.buy_executed.toString()).substring(0, 10)}</Text> for <Text style={{fontWeight:'bold'}}>{stock.buy_price}</Text></Text>
                                        </View>
                                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                            <TouchableOpacity onPress={() => {this.sell(stock.id)}} style={{padding: 8, marginTop: 10, flexDirection:'row', alignItems:'center', backgroundColor: 'rgb(150,150,150)', borderRadius: 10}}>
                                                <Text color="white">Sell {stock.quantity} for {parseFloat(stock.current_price * stock.quantity).toFixed(2)}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }
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