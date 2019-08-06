import React, {Component} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Image} from 'react-native';

import firebase from 'react-native-firebase';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import FingerprintScanner from 'react-native-fingerprint-scanner';

const fingerprintIcon = 'https://www.materialui.co/materialIcons/action/fingerprint_white_192x192.png';

class Login extends Component{

    static defaultProps = {
        onLogin: () => {}
    }

    state = {
        email: '',
        password: '',
        errorMessage: '',
        isNewUser: false,
        isScanning: false,
        scannerMessage: 'Autentique com sua digital'
    }

    async componentDidMount(){
        const auth = firebase.auth(),
            currentUser = auth.currentUser;

        GoogleSignin.configure({
            webClientId: '343290796990-72m9eisnvf88uebk80f7qpi12495esh3.apps.googleusercontent.com'
        });

        if(currentUser !== null){
            try{
                await FingerprintScanner.isSensorAvailable();
                this.startScanner(currentUser);
            }catch(error){
                this.props.onLogin(currentUser);
            }
        }
        
    }

    startScanner = async (user) => {
        if(!this.state.isScanning){
            this.setState({isScanning: true}, async () => {
                try{
                    await FingerprintScanner
                        .authenticate({
                            onAttempt: () => {
                                this.setState({scannerMessage: 'Tente Novamente'});
                            }
                        })

                    this.props.onLogin(user);
                }catch(error){
                    this.stopScanner();
                }
            })
        }
    }

    stopScanner = async () => {
        this.setState({isScanning: false});
        FingerprintScanner.release();
    }



    login = async () => {
        const auth = firebase.auth(),
            {email, password} = this.state;

        try{
            const response = await auth.signInWithEmailAndPassword(email, password);
            this.props.onLogin(response);
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
                const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
                this.props.onLogin(response);
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
        const response = await firebase.auth().signInWithCredential(credential);
        this.props.onLogin(response.user);
    }

    render(){
        const {props, state} = this,
            {errorMessage, isNewUser, isScanning, scannerMessage} = state;
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
                 {
                     !isScanning ? false :
                     <View style={styles.scannerContainer} >
                        <Image style={styles.fingerprintIcon} source={{uri: fingerprintIcon}} />
                        <Text style={styles.scannerMessage} >{scannerMessage}</Text>
                        <Button title="Cancelar" onPress={this.stopScanner} color="red" />
                    </View>
                 }
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
    },
    scannerContainer: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(25, 25, 97, .9)',
        zIndex: 5,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fingerprintIcon: {
        width: 100,
        height: 100
    },
    scannerMessage: {
        fontSize: 25,
        color: 'white',
        marginBottom: 40
    }
});

export default Login;