import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Dimensions} from 'react-native';
import { LineChart } from 'react-native-chart-kit'

export default class Fetch extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoaded: false,
            formattedData: []
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
            console.log(parsedResponse)
        } else {
            console.log(parsedResponse.data)
        }
    }
    componentDidMount() {
        this.updateStocks()
    }
    render() {
        return (
            <View>
            { this.state.isLoaded ? 
            this.state.formattedData.map((object) => {
                return (
                    <View>
                    <LineChart
                    data={{
                      labels: [object.data[1].date, object.data[99].date],
                      datasets: [
                        {
                          data: [20]
                        }
                      ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel="$"
                    yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                      backgroundColor: "orange",
                      backgroundGradientFrom: "#fb8c00",
                      backgroundGradientTo: "#ffa726",
                      decimalPlaces: 2, // optional, defaults to 2dp
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16
                      },
                      propsForDots: {
                        r: "6",
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
            }) : null }
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    color: 'white',
    flex: 1,
    backgroundColor: 'rgb(18,18,18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
