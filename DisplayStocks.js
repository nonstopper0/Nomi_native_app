import React from 'react';
import { Text, View, TextInput,  Keyboard, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import { LineChart } from 'react-native-chart-kit'
import { Ionicons, AntDesign } from '@expo/vector-icons'

export default class DisplayStocks extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoaded: false,
            formattedData: [],
            name: '',
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
                isLoaded: true
            })
        } else {
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
      console.log('submitted')
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
                marginTop: 10, 
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
                  <AntDesign name="checkcircle" size={40} style={{padding: 10}}color={ this.state.name ? 'orange' : 'grey' }/>
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
                      <Text style={{padding: 10, fontSize: 20, color: 'white', fontWeight: 'bold'}}>{`${compared}%`} | <Text style={{color: 'orange'}}>{stock.name}</Text> | {current} </Text>
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
                      segments={Math.floor(Dimensions.get("window").height/70)}
                      width={Dimensions.get("window").width-20}
                      height={Dimensions.get("window").height/3}
                      yAxisLabel="$"
                      yAxisInterval={10} // optional, defaults to 1
                      chartConfig={{
                        backgroundColor: "orange",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                          padding: 20,
                          borderRadius: 16
                        },
                        propsForDots: {
                          r: "1",
                          strokeWidth: "2",
                          stroke: "#ffa726"
                        }
                      }}
                      bezier
                      style={{
                        marginVertical: 8,
                        borderRadius: 16
  
                      }}
                    />
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