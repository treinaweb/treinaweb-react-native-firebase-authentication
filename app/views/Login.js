import React, {Component} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

import firebase from 'react-native-firebase';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

class Login extends Component{

    static defaultProps = {
        onLogin: () => {}
    }

    state = {
        email: '',
        password: '',
        errorMessage: '',
        isNewUser: false
    }

    async componentDidMount(){
        const auth = firebase.auth();
        GoogleSignin.configure({
            webClientId: '343290796990-72m9eisnvf88uebk80f7qpi12495esh3.apps.googleusercontent.com'
        });

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

    resetPassword = () => {
        const {email} = this.state;
        if(email){
            firebase.auth().sendPasswordResetEmail(email);
        }
    }

    signInEmail = async () => {
        const {email, password} = this.state;
        if(password.length >= 6){
            try{
                await firebase.auth().createUserWithEmailAndPassword(email, password);
            }catch(error){}
        }else{
            return false;
        }
    }

    signInGoogle = async () => {
        try{
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken);
            this.signIn(credential);
        }catch(error){}
    }

    signIn = async (credential) => {
        return firebase.auth().signInWithCredential(credential);
    }

    render(){
        const {props, state} = this,
            {errorMessage, isNewUser} = state;
        return (
            <View style={styles.view} >
                <View>
                    <Button title={isNewUser ? 'Fazer Login' : 'Novo Cadastro'} onPress={() => this.setState({isNewUser: !isNewUser})} />
                </View>

                <View style={styles.loginBox} >
                    <TextInput style={styles.loginInput} placeholder="Email" keyboardType={'email-address'} autoCapitalize={'none'} onChangeText={email => this.setState({email})} />
                    <TextInput style={styles.loginInput} placeholder="Senha" secureTextEntry={true} onChangeText={password => this.setState({password})} />
                    {
                        !isNewUser ?
                        <View>
                            <Button title="Login" onPress={this.login} />
                            <Button title="Resetar Senha" onPress={this.resetPassword} />
                        </View>
                        :
                        <Button title="Cadastrar" onPress={this.signInEmail} />
                    }
                    <Text style={styles.loginError} >{errorMessage}</Text>
                </View>
                <GoogleSigninButton
                    style={styles.googleButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={this.signInGoogle}
                 />
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
    },
    googleButton: {
        width: 180,
        height: 55
    }
});

export default Login;