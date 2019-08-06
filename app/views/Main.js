import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, Modal, Button } from 'react-native';

import { ListsService } from '../services/ListsService';
import ListsView from './ListsView';
import UserView from './UserView';
import List from '../components/List';

export default class App extends Component {
    static defaultProps = {
        user: null,
        onLogout: () => {},
        onUpdateUser: () => {}
    }

    state = {
        lists: [],
        isLoading: false,
        modalVisible: false,
        selectedList: {},
        isUserViewVisible: false
    }

    async componentDidMount() {
        //this.getLists();
        ListsService.watch((lists) => {
            this.setState({ lists });
        })
    }

    getLists = async () => {
        this.setState({ isLoading: true });
        const lists = await ListsService.list();
        this.setState({ lists, isLoading: false });
        return lists;
    }
    selectList = (selectedList) => {
        this.setState({
            selectedList,
            modalVisible: true
        })
    }
    createList = async () => {
        const newList = await ListsService.create({ title: 'Nova Lista', description: '', picture: '', items: [] }),
            lists = await ListsService.list();

        this.setState({ lists }, () => {
            this.selectList(newList);
        })
    }
    updateList = async (newList) => {
        await ListsService.update(newList);
        const lists = await ListsService.list();
        this.setState({
            lists,
            selectedList: {},
            modalVisible: false
        })
    }
    removeList = async (listToRemove) => {
        await ListsService.remove(listToRemove.id);
        const lists = await ListsService.list();
        this.setState({ lists });
    }

    openUserView = () => {
        this.setState({isUserViewVisible: true});
    }

    closeUserView = () => {
        this.setState({isUserViewVisible: false});
    }

    render() {
        const { state, props } = this;

        if(state.isUserViewVisible){
            return(
                <SafeAreaView style={styles.container} >
                    <UserView user={props.user} onLogout={props.onLogout} onClose={this.closeUserView} onUpdateUser={props.onUpdateUser} />
                </SafeAreaView>
            )
        }
        

        return (
            <SafeAreaView style={styles.container}>
                <Button title="+ Nova Lista" onPress={this.createList} style={{ flex: 1 }} color="green" />
                <ScrollView refreshControl={<RefreshControl
                    refreshing={state.isLoading}
                    onRefresh={this.getLists}
                />}>
                    <ListsView lists={state.lists} onRemove={this.removeList} onSelect={this.selectList} />
                </ScrollView>
                <Button title="o/" onPress={this.openUserView} />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={state.modalVisible}
                >
                    <List list={state.selectedList} onActionDone={this.updateList} />
                </Modal>
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
        width: '100%'
    }
});
