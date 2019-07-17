import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, Button } from 'react-native';

import firebase from 'react-native-firebase';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      list: [],
      user: null
    };
  }

  async componentDidMount() {
    console.clear();
    const db = firebase.firestore(),
      auth = firebase.auth();
    const collection = db.collection('livros');

    await auth.signInWithPhoneNumber('+55 11 99999-9999');
    
    auth.onAuthStateChanged((user) => {
      console.log(user);
      this.setState({user});
    })

    
    const unsubscribe = collection.onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach(doc => {
        list.push(doc.data());
      })
      this.setState({list});
    });
  }

  login = async () => {
    const auth = firebase.auth();
    return auth.signInWithEmailAndPassword('abc@teste.com', '123456');
  }

  logout = () => {
    const auth = firebase.auth();
    return auth.signOut();
  }

  render() {
    const {state} = this;
    return (
      <ScrollView>
        <View style={styles.container}>
          <Image source={require('./assets/ReactNativeFirebase.png')} style={[styles.logo]}/>
          {
            state.user && !state.user.isAnonymous ?
            <Button title={'Logout'} onPress={this.logout} /> : 
            <Button title={'Login'} onPress={this.login} />
          }
          {
            state.list.map(item => <Text key={item.nome} >{item.nome}</Text>)
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
