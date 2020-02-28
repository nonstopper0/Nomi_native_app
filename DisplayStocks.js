import React from 'react';
import { Text, View, TextInput,  Keyboard, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import { LineChart } from 'react-native-chart-kit'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

export default class DisplayStocks extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoaded: false,
            formattedData: [],
            name: '',
            numToBuy: 1,
        }
    }
    updateStocks = async(e) => {
        const response = await fetch(`https://nomistockexpress.herokuapp.com/stock/all/${this.props.loggedID}`, {
            method: 'GET'
        })
        // reset state before adding again
        this.setState({
            formattedData: []
        })
        const parsedResponse = await response.json()
        if (parsedResponse.status === 200) {
            this.setState({
                formattedData: parsedResponse.data,
                isLoaded: true,
                addLoaded: true
            })
        } else {
        }
    }
    buyStock = async(name) => {
      console.log('buying stock')
      let stockName = name
      let numberToBuy = this.state.numToBuy
      this.setState({
          numToBuy: 1
      })
      let data = {
          num: numberToBuy,
          user: this.props.loggedID
      }
      const response = await fetch(`https://nomistockexpress.herokuapp.com/stock/buy/${stockName}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
              'Content-Type': 'application/json'
          }
      })
      const parsedResponse = await response.json()
      if (parsedResponse.status === 400) {
          this.setState({
              addStockMessage: parsedResponse.data
          })
      } else if (parsedResponse.status === 200) {
          console.log(parsedResponse)
          let finalPrice = parseFloat(parsedResponse.data[0]*parsedResponse.data[1]).toFixed(2)
          this.props.subtract('subtract', finalPrice)
          this.setState({
              addStockMessage: `Congrats, you have succesfully purchased ${parsedResponse.data[1]} of ${parsedResponse.data[2]} for ${finalPrice}`
          })
      }
    }
    removeStock = async(name) => {
      const response = await fetch(`https://nomistockexpress.herokuapp.com/stock/${name}/${this.props.loggedID}`, {
          method: 'DELETE'
      })
      const newData = this.state.formattedData.filter((data) => data.name !== name)
      this.setState({
          formattedData: newData
      })
    }
    handleSubmit = async(e) => {
      this.setState({addLoaded: false})
      const stockName = (this.state.name).toString().toUpperCase()
      try {
         const response = await fetch(`https://nomistockexpress.herokuapp.com/stock/add/${stockName}/${this.props.loggedID}`, {
             method: 'POST'
         })
         const parsedResponse = await response.json()
         if (parsedResponse.status === 200) {
             this.setState({
                 message: '',
                 name: ''
             })
             this.updateStocks()
         } else if (parsedResponse.status === 400) {
           console.log('failed')
             this.setState({
                 message: parsedResponse.data,
                 name: ''
             })
         }
         this.setState({addLoaded: true})
    } catch(err) {
      console.log(err)
    }
  }
    componentDidMount() {
        this.updateStocks()
    }
    render() {
        return (
          <View style={{flex: 1}}>
            { this.state.isLoaded ? 
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
                marginTop: (Platform.OS === 'ios' ? 80 : 110),
                marginBottom: 12,
                justifyContent: 'space-evenly'
                }}
              >
                  <Text style={{fontWeight: 'bold', textAlign: 'auto', color: 'white', fontSize: 25, margin: 10}}>Add <Text style={{color: 'orange'}}>Stock</Text></Text>
                  <TextInput
                      onBlur={Keyboard.dismiss}
                      autoCapitalize="none"
                      value={this.state.name}
                      style={{borderRadius: 10, textAlign: 'center', height: 45, color: 'white', backgroundColor: 'rgb(28,28,28)', padding: 5, fontSize: 18, margin: 5, width: '40%', alignSelf:'center'}}
                      placeholder="Stock name"
                      placeholderTextColor="gray"
                      onChangeText={(text) => this.setState({name: text})}
                      onSubmitEditing={this.handleSubmit}
                      />
                <TouchableOpacity disabled={this.state.name ? false : true } onPress={()=>this.handleSubmit()} style={{alignItems: 'center'}}>
                      {this.state.addLoaded ? <AntDesign name="checkcircle" size={40} style={{padding: 10}}color={ this.state.name ? 'orange' : 'grey' }/> : <ActivityIndicator style={{padding: 10}}size="large" color="white"/> }
                </TouchableOpacity>
              </View>
              { this.state.message ? 
              <Text style={{color: 'white', textAlign: 'center', margin: 10, fontSize: 17}}>{this.state.message}</Text>
              : null }
              { this.state.formattedData.map((stock) => {
                let dateArray = []
                stock.data.map((date, index) => {
                  if (index % 12 === 0) {dateArray.push(date.date)} 
                })
                let dataArray = []
                stock.data.map((data, index) => {
                  dataArray.push(data.open)
                })
                const indexOfLast = stock.data.length-1
                const compared = (stock.data[indexOfLast].open - (stock.data[indexOfLast-1].open)).toFixed(2)
                const current = `$${(parseFloat(stock.data[indexOfLast].open).toFixed(2))}`
                  return (
                      <View key={stock.name} style={{flex: 1, alignItems: 'center', width: Dimensions.get("window").width, backgroundColor: 'rgb(38,38,38)', borderRadius: 20, marginBottom: 12}}>
                      <Text style={{padding: 10, fontSize: 20, color: 'white', fontWeight: 'bold'}}>{`${compared}`} | <Text style={{color: 'orange'}}>{stock.name}</Text> | {current} </Text>
                      <TouchableOpacity onPress={() => this.removeStock(stock.name)} style={{position: 'absolute', left: '88%', top: 10}}>
                        <Ionicons name="md-remove" size={32} color="grey"/> 
                      </TouchableOpacity>

                      <LineChart
                      data={{
                        labels: dateArray,
                        datasets: [
                          {
                            data: dataArray
                          }
                        ]
                      }}
                      segments={Math.floor(Dimensions.get("window").height/100)}
                      width={Dimensions.get("window").width-20}
                      height={Dimensions.get("window").height/3}
                      yAxisLabel="$"
                      yAxisInterval={10} // optional, defaults to 1
                      chartConfig={{
                        backgroundColor: "black",
                        backgroundGradientFrom: "rgb(59,59,59)",
                        backgroundGradientTo: "rgb(28,28,28)",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${0.1})`,
                        labelColor: () => `rgba(255, 255, 255, ${.8})`,
                        style: {
                          padding: 20,
                          borderRadius: 16,
                        },
                        propsForDots: {
                          r: "0",
                          strokeWidth: "1",
                          stroke: "",
                        }
                      }}
                      bezier
                      style={{
                        marginVertical: 8,
                        borderRadius: 16
  
                      }}
                    /> 
                    <View style={{flex: 1, flexDirection: "row", alignItems: "center", margin: 10, justifyContent: "space-evenly", width: '90%', height: 40}}>
                    <TouchableOpacity style={{backgroundColor: 'orange', borderRadius: 50}} onPress={()=> this.state.numToBuy > 1 ? this.setState({numToBuy: this.state.numToBuy - 1}) : null}>
                    <AntDesign color="white" name="minus" size={32}/> 
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: 'rgb(68,68,68)', padding: 10, borderRadius: 20}}>
                    <Text style={{color: 'white'}}>Buy {this.state.numToBuy} of {stock.name} for {(parseFloat(stock.data[stock.data.length-1].open).toFixed(2) * this.state.numToBuy).toFixed(2)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: 'orange', borderRadius: 50}} onPress={()=>this.setState({numToBuy: this.state.numToBuy + 1})}>
                    <AntDesign color="white" name="plus" size={32}/> 
                    </TouchableOpacity>
                    </View>
                    </View>
                  )
              })}
              </ScrollView>
            </View>
            :
            <ActivityIndicator style={{position: 'absolute', left: -20, top: '45%'}}size="large" color="white"/>  
            }
          </View>
        );
    }
}