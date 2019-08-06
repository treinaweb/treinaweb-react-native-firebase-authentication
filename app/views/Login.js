import React, {Component} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

import firebase from 'react-native-firebase';

class Login extends Component{

    static defaultProps = {
        onLogin: () => {}
    }

    state = {
        email: '',
        password: '',
        errorMessage: ''
    }

    async componentDidMount(){
        const auth = firebase.auth();

        this.onAuthStateUnsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                this.props.onLogin(user);
            }
        })
    }

    componentWillUnmount(){
        this.onAuthStateUnsubscribe();
    }



    login = async () => {
        const auth = firebase.auth(),
            {email, password} = this.state;

        try{
            const response = await auth.signInWithEmailAndPassword(email, password);
        }catch(error){
            this.setState({errorMessage: 'Email e/ou Senha inválidos'});
        }
    }

    render(){
        const {props, state} = this,
            {errorMessage} = state;
        return (
            <View style={styles.view} >
                <View style={styles.loginBox} >
                    <TextInput style={styles.loginInput} placeholder="Email" keyboardType={'email-address'} autoCapitalize={'none'} onChangeText={email => this.setState({email})} />
                    <TextInput style={styles.loginInput} placeholder="Senha" secureTextEntry={true} onChangeText={password => this.setState({password})} />
                    <Button title="Login" onPress={this.login} />
                    <Text style={styles.loginError} >{errorMessage}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginBox: {
        width: '90%',
        borderWidth: 2,
        padding: 15
    },
    loginInput: {
        fontSize: 18,
        margin: 5
    },
    loginError: {
        color: 'red'
    }
});

export default Login;