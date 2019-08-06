import React, {Component} from 'react';
import {View, ScrollView, Text, TextInput, Button, StyleSheet, Image} from 'react-native';

import firebase from 'react-native-firebase';
import {GoogleSignin} from 'react-native-google-signin';

const userPicturePlaceholder = 'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png';


class UserView extends Component{
    static defaultProps = {
        user: {},
        onClose: () => {},
        onLogout: () => {},
        onUpdateUser: () => {}
    }

    logout = async () => {
        const auth = firebase.auth();
        await auth.signOut();
        this.props.onLogout();
    }

    linkWithGoogle = async () => {
        try{
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const credential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken);
            this.linkWithCredential(credential);
        }catch(error){}
    }

    linkWithCredential = async (credential) => {
        await firebase.auth().currentUser.linkWithCredential(credential);
        this.props.onUpdateUser();
    }

    unlinkCredential = async (providerId) => {
        await firebase.auth().currentUser.unlink(providerId);
        this.props.onUpdateUser();
    }

    connectButtonGoogle = () => {
        const {user} = this.props;
        if(user.providerData.some(({providerId}) => providerId === 'google.com')){
            if(user.providerData.length > 1){
                return <Button title="Desconectar do Google" onPress={() => this.unlinkCredential('google.com')} />
            }
            return  false;
        }
        return <Button title="Conectar com Google" onPress={() => this.linkWithGoogle()} />
    }

    render(){
        const {props, state} = this,
            {user} = props;
        return (
            <View style={styles.view} >
                <View style={styles.header} >
                    <Button title="X" color="red" onPress={this.props.onClose} />
                </View>
                <ScrollView style={styles.container} >
                    <View style={styles.userProfile} >
                        <Image style={styles.userPicture} source={{uri: (user.photoURL || userPicturePlaceholder)}} />
                        <Text style={styles.userProfileName} >{user.displayName || user.email}</Text>
                    </View>
                    <View>
                        {this.connectButtonGoogle()}
                    </View>
                    <Button title="Logout" onPress={this.logout} />
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    view: {
        flex: 1,
        width: '100%'
    },
    userProfile: {
        backgroundColor: '#4785ee',
        margin: 5,
        padding: 5,
        alignItems: 'center'
    },
    userProfileName:{
        color: 'white',
        fontSize: 20
    },
    userPicture: {
        width: 100,
        height: 100
    }
})

export default UserView;