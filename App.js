import React from 'react';
import {Platform, FlatList, TouchableOpacity, KeyboardAvoidingView, Dimensions, Alert, TextInput, StyleSheet, Text, View, ScrollView, } from 'react-native';
import Button from 'react-native-button'
import Constants from 'expo-constants'
import StopwatchWithLabelNoButtons from './StopwatchWithLabelNoButtons'
import DraggableFlatList from 'react-native-draggable-flatlist'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count:0,
      mainHeight:0,
      timers: [
        {
          time:14544,
          running:false,
          id:0,
          label:"Timer 1"
        },
        {
          time:1338,
          running:false,
          id:1,
          label:"Timer 2"
        },
        {
          time:6632,
          running:false,
          id:2,
          label:"Timer 3"
        },
        {
          time:9130,
          running:false,
          id:3,
          label:"Timer 4"
        },
        {
          time:11111,
          running:false,
          id:4,
          label:"Timer 5"
        },
      ]
    }
  }

  componentDidMount = () => {
    this.setState({
      count:this.state.timers.length
    })
    setInterval(this.tick,200)
  }

  addTimer = () => {
    this.setState(prevState => ({
      timers: [...prevState.timers,{
        running:false,
        id:this.state.count+1,
        time:0,
        label:"Timer " + (this.state.count + 1)
      }],
      count:prevState.count+1
    }))
  }

  tick = () => {
    this.setState(prevState => ({
      timers:prevState.timers.map((timer) => {
        if(timer.running) {
          timer.time = timer.time + 0.2
        }
        return timer
      })
    }))
  }

  handleClick = (id) => {
    this.setState(prevState => ({
      timers:prevState.timers.map((timer) => {
        if(timer.id === id) {
          timer.running = !(timer.running)
        }
        // else {
        //   timer.running = false
        // }
        return timer
      })
    }))
  }

  onReset = (id) => {
    this.setState(prevState => ({
      timers:prevState.timers.map(timer => {
        if (timer.id == id) {
          timer.running = false
          timer.time = 0
        }
        return timer
      })
    }))
  }

  onDelete = (id) => {
    this.setState(prevState => ({
      timers:prevState.timers.filter(function(timer) {return timer.id !== id }),
    }))
  }

  resetAll = () => {
    this.setState(prevState => ({
      timers:prevState.timers.map(timer => {
        timer.running = false
        // timer.time = !(timer.time)
        timer.time = 0
        return timer
      })
    }))
  }

  setDimension = (event) => {
    this.setState({
      mainHeight:event.nativeEvent.layout.height
    },()=>{console.log(this.state.mainHeight)})
  }

  onLabelChange = (id,text) => {
    this.setState(prevState => ({
      timers:prevState.timers.map((timer) => {
        if (timer.id == id) {
          timer.label = text
        }
        return timer
      })
    }))
    // this.forceUpdate()
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.window}>
        <View style={styles.header}>
        </View>
        <View  style={styles.main} onLayout={(event) => this.setDimension(event)}>
          <FlatList
            contentContainerStyle={{flex:1}}
            extraData={this.state.mainHeight}
            key={this.state.timers.length}
            numColumns={(this.state.timers.length > 8 ? 3 : 2)}
            data={this.state.timers}
            renderItem={({item,index}) => (
                <TouchableOpacity style={[styles.timer,{height: (this.state.mainHeight - 4)/Math.ceil(this.state.timers.length/(this.state.timers.length > 8 ? 3 : 2)) }]} onPress={() => {this.handleClick(item.id)}}>
                  <StopwatchWithLabelNoButtons
                    running={item.running}
                    label={item.label}
                    color={colors[(item.id % colors.length)]}
                    onDelete={this.onDelete}
                    id={item.id}
                    time={item.time}

                    onReset={this.onReset}
                    onLabelChange={this.onLabelChange}
                  />
                </TouchableOpacity>
            )}
            keyExtractor={item=>(item.id+String(this.state.timers.length))}
          />
        </View>

        <View style={styles.footer}>
          <Button style={styles.addButton} onPress={this.addTimer} disabled={this.state.timers.length > 11}>
            Add Timer
          </Button>
          <Button style={styles.resetAllButton} onPress={this.resetAll}>
            Reset All
          </Button>
        </View>
      </KeyboardAvoidingView>
    )
  }
}



const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  window: {
    flex:1,
  },
  timer: {
    flex:1,
    padding:2
  },
  header: {
    height:Constants.statusBarHeight,
    backgroundColor:'#1f1f47'
  },
  main: {
    flex:17,
    padding:2
  },
  footer: {
    paddingTop:10,
    flex:1,
    backgroundColor:'#eee',
  },
  addButton: {
    position:'absolute',
    left:'20%'
  },
  resetAllButton: {
    position:'absolute',
    right:'20%'
  }
});

const colors = [
  {running:'#c98a7e',paused:'#EAC8C2'},
  {running:'#7E7F9A',paused:'#e1e1e8'},
  {running:'#97A7B3',paused:'#c8cdd1'},
  {running:'#AFC685',paused:'#DCE2D0'},

  {running:'#97A7B3',paused:'#c8cdd1'},
  {running:'#c98a7e',paused:'#EAC8C2'},

  {running:'#97A7B3',paused:'#c8cdd1'},/*original running color:D5E2BC*/
]
