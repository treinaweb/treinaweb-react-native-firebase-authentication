import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, RefreshControl, Modal, Button} from 'react-native';

import Main from './app/views/Main';
import Login from './app/views/Login';
import firebase from 'react-native-firebase';

export default class App extends Component {
  state = {
    isLogged: false,
    user: null
  }

  onUpdateUser = async () => {
    const auth = firebase.auth();
    await auth.currentUser.reload();
    this.setState({user: auth.currentUser});
  }

  onLogin = async (user) => {
    this.setState({user, isLogged: true});
  }

  onLogout = async () => {
    this.setState({user: null, isLogged: false});
  }

  render() {
    const {state} = this;
    return (
      <SafeAreaView style={styles.container}>
        {
          state.isLogged ? 
          <Main user={state.user} onLogout={this.onLogout} onUpdateUser={this.onUpdateUser} />:
          <Login onLogin={this.onLogin} />
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
