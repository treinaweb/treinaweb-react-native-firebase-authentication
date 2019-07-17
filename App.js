import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';

import firebase from 'react-native-firebase';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      list: []
    };
  }

  async componentDidMount() {
    const db = firebase.firestore();
    const collection = db.collection('livros');
    
    const unsubscribe = collection.onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      })
      this.setState({list});
    });
  }

  render() {
    const {state} = this;
    return (
      <ScrollView>
        <View style={styles.container}>
          <Image source={require('./assets/ReactNativeFirebase.png')} style={[styles.logo]}/>
          <Text style={styles.welcome}>
            Welcome to {'\n'} React Native Firebase
          </Text>
          {
            state.list.map(item => <Text>{item.nome}</Text>)
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    marginTop: 64,
    padding: 10,
    width: 135,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
