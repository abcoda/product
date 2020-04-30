import React from 'react'
import {Button,View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
  clock:{
    paddingBottom:10,
    fontSize:40,
  },
  container:{
    flex:1,
    borderRadius:10,
    justifyContent:'center'
  },
  label: {
    paddingTop:5,
    alignItems:'center',
  },
  deleteButton: {
    position:'absolute',
    right:7,
    top:1
  },
  resetButton: {
    position:'absolute',
    right:7,
    bottom:5
  },
  topBar: {
    alignItems:'center',

  },
  bottom: {
    alignItems:'center',
  }
})

export default class StopwatchWithLabelNoButtons extends React.Component {
  constructor(props) {
    super(props)
    this.color = props.color
    this.id = props.id,
    this.onDelete = props.onDelete
    this.onReset = props.onReset
    this.state = {
      running: this.props.running,
      label: props.label,
      time: props.time,
    }
  }

  componentDidMount = () => {
    if (this.state.running) {
      this.interval = setInterval(this.tick,100)
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.running !== prevProps.running) {
      this.setState({
        running:this.props.running
      })
      if (this.props.running) {
        this.interval = setInterval(this.tick,1000)
      }
      else {
        clearInterval(this.interval)
      }
    }
    if (this.props.time !== prevProps.time) {
      this.setState({
        time:0
      })
    }
  }

  tick = () => {
    if (this.state.running) {
      this.setState(prevState => ({
        time:prevState.time+1
      }))
    }
  }

  handleReset = () => {
    this.onReset(this.id)
    this.setState({
      time:0
    })
  }

  render() {
    const t = Math.floor(this.state.time+0.5)
    const hours = Math.floor(t/3600)
    const minutes = Math.floor(t/60)%60
    const seconds = t%60
    return (
      <View style={[styles.container,{backgroundColor:(this.state.running ? this.color.running : this.color.paused),}]}>
        <View style={styles.topBar}>
          <TouchableOpacity style={[styles.label,{borderBottomColor:(this.state.running ? '#111' : '#888'),borderBottomWidth:1}]}>
            <TextInput
              style={{
                width:'75%',
                fontSize:20,
                textAlign:'center',
                color:this.state.running ? '#111' : '#666',
              }}
              value={String(this.state.label)}
              onChangeText={(text) => {this.setState({label:text})}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottom}>
          <Text style={[styles.clock,{color:this.state.running ? '#111' : '#888'}]}>
            {(hours > 0 ? hours + ':' : '') +
            (hours > 0 && minutes < 10 ? '0' : '' )+
            minutes +
            ':' +
            (seconds>9 ? '' + seconds : '0' + seconds)}
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => {this.onDelete(this.id)}}>
          <Icon name="times" size={30} color={(this.state.running ? this.color.paused : this.color.running)}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={this.handleReset}>
          <Icon name="refresh" size={28} color={(this.state.running ? this.color.paused : this.color.running)}/>
        </TouchableOpacity>
      </View>
    );
  }
}
