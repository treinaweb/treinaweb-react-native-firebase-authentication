import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, Button } from 'react-native';

import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

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

    GoogleSignin.configure({
      webClientId: '791527872979-j9kmo1u1re9vncttk0te4bo3om69kar3.apps.googleusercontent.com'
    });

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

  loginGoogle = async () => {
      try{
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo);
        const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken);
        
        //firebase.auth().currentUser.linkWithCredential(credential);
        //await firebase.auth().signInWithCredential(credential);
      }catch(error){

      }
  }

  logoutGoogle = async () => {
    try{
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut()
    }catch(error){

    }
  }

  createAccount = () => {
    const auth = firebase.auth(),
      email = 'def@teste.com',
      password = '123123';

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    
    auth.currentUser.linkWithCredential(credential);
  }

  linkWithPhone = async () => {
    const phoneNumber = '+55 11 99999-9999',
      verificationCode = '112233',
      auth = firebase.auth();
    const verification =  await auth.signInWithPhoneNumber(phoneNumber);
    
    const phoneCredential = firebase.auth.PhoneAuthProvider.credential(verification.verificationId, verificationCode);

    auth.currentUser.linkWithCredential(phoneCredential);
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
          <Button title={'Nova Conta'} onPress={this.createAccount} />
          <Button title={'Ligar com Telefone'} onPress={this.linkWithPhone} />
          {
            state.list.map(item => <Text key={item.nome} >{item.nome}</Text>)
          }
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            style={{width: 180, height: 55}}
            onPress={this.loginGoogle}
          />
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
