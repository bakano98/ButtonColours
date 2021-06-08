import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DialogInput from 'react-native-dialog-input';

const COLOUR_KEY = 'colour_key';

export default class Buttons extends React.Component {
  // store some state for colours
  state = {
    clicks: 0,
    buttonColour: 'red',
    isDialogVisible: false
  }

  increase = () => {
    this.setState({clicks: this.state.clicks+1})
  }

  setCustom = () => { 
    this.setState({ isDialogVisible: true })
  }

  handleCancel = () => {
    this.setState({ isDialogVisible: false})
  }
  
  handleConfirm = (inputText) => {
    console.log(inputText);
    this.storeColour(COLOUR_KEY, inputText);
    this.setState({ isDialogVisible: false });
  }

  // AsyncStorage for persistent state
  storeColour = async (key, colour) => {
    try {
      await AsyncStorage.setItem(COLOUR_KEY, JSON.stringify(colour));
      this.setState({buttonColour: colour});
    } catch (e) {
      console.log(e)
    }
  }
 
  // to load data from storage
  loadAsyncData = async () => {
    try {
      const showColour = await AsyncStorage.getItem(COLOUR_KEY);
      if (showColour != null) {
        this.setState({buttonColour: JSON.parse(showColour)})
      } 
    } catch (e) {
      console.log(e);
    }
  }


  componentDidMount() {
    this.loadAsyncData();
  }

  componentDidUpdate() {
    this.loadAsyncData();
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
            title={"Custom colour"}
            message={"What colour do you want? (provide HEX codes with # for better accuracy"}
            submitInput={ (inputText) => {this.handleConfirm(inputText)} }
            closeDialog={ () => {this.handleCancel()}}>
          </DialogInput>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <TouchableOpacity style={[styles.button, {backgroundColor: 'red'}, {marginRight: 1}]} onPress={() => this.storeColour(COLOUR_KEY, 'red')}>
            <Text style={styles.text}> Red </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {backgroundColor: 'blue'}, {marginRight: 1}]} onPress={() => this.storeColour(COLOUR_KEY, 'blue')}>
            <Text style={styles.text}> Blue </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {backgroundColor: 'orange'}, {marginRight: 1}]} onPress={() => this.storeColour(COLOUR_KEY, 'orange')}>
            <Text style={styles.text}> Orange </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {backgroundColor: 'green'}, {marginRight: 1}]} onPress={() => this.setCustom()}>
            <Text style={styles.text}> Custom </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={[styles.button, {backgroundColor: this.state.buttonColour}, {marginRight: 1}]} onPress={() => this.increase()}>
            <Text style={styles.text}> Increase </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {backgroundColor: this.state.buttonColour}, {marginRight: 1}]} onPress={() => this.setState({clicks: 0})}>
            <Text style={styles.text}> Reset </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.text}>
          <Text> Number of times clicked: {this.state.clicks} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center'},
  button: {alignItems: 'center', width: 100},
  text: {fontSize: 15, color: 'white'} 
})