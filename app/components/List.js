import React, { Component } from 'react';
import { SafeAreaView, TouchableHighlight, View, TextInput, Image, Button, FlatList, ScrollView, Clipboard } from 'react-native';

import ListItem from './ListItem';

class List extends Component{
    static defaultProps = {
        list: {body: {items: []}},
        onActionDone: () => {}
    }
    state = {
        list: {body: {items: []}},
        newItemDescription: ''
    }
    componentDidMount(){
        const {list} = this.props;
        if(!list.body.items){
            list.body.items = [];
        }
        this.setState({list});
    }

    updateList = (field, value) => {
        this.setState(({list}) => {
            const newBody = Object.assign({}, {...list.body}, {[field]: value}),
                newList = Object.assign({}, list, {body: newBody});
            return {list: newList};
        })
    }

    createListItem = () => {
        const description = this.state.newItemDescription;
        if(description){
            const newItem = {description, done: false, id: Date.now().toString()};
            this.updateListItem(newItem);
            this.setState({newItemDescription: ''});
        }
    }

    updateListItem = (item) => {
        const {list} = this.state,
            itemIndex = list.body.items.findIndex(listItem => listItem.id === item.id),
            newListItems = [...list.body.items];
        if(itemIndex >= 0){
            newListItems[itemIndex] = item;
        }else{
            newListItems.push(item);
        }
        this.updateList('items', newListItems);
    }
    removeListItem = (item) => {
        const {list} = this.state,
            itemIndex = list.body.items.findIndex(listItem => listItem.id === item.id),
            newListsItems = [...list.body.items];
        newListsItems.splice(itemIndex, 1);
        this.updateList('items', newListsItems);
    }

    pasteImage = async () => {
        const picture = await Clipboard.getString(),
            types = ['.png', '.jpg', '.jpeg'];
        if(picture.startsWith('http') && types.some(type => picture.endsWith(type))){
            this.updateList('picture', picture);
        }
    }

    keyExtractor(item){
        return item.id;
    }

    render(){
        const {state} = this,
            {list} = state,
            picture = list.body.picture || 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png';
        return (
            <SafeAreaView style={{flex:1}} >
                <Button title="< Voltar" onPress={() => this.props.onActionDone(this.props.list)} />
                <ScrollView style={{flex: 1}} >
                    <TextInput 
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, fontSize: 20, fontWeight: 'bold'}}
                        placeholder="Titulo"
                        onChangeText={(text) => this.updateList('title', text)}
                        value={list.body.title}
                        />
                    <View style={{flex: 1, flexDirection: 'row', padding: 5}} >
                        <TouchableHighlight onPress={this.pasteImage} >
                            <Image source={{uri: picture}} style={{width: 100, height: 100, marginRight: 10}} />
                        </TouchableHighlight>
                        <TextInput
                            style={{borderColor: 'gray', borderWidth: 1, padding: 5, flex: 1}}
                            placeholder="Descricao"
                            onChangeText={(text) => this.updateList('description', text)}
                            value={list.body.description}
                            numberOfLines={3}
                            multiline={true} 
                        />
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', height: 40}} >
                        <TextInput 
                            style={{height: 40, flex: 1, borderColor: 'gray', borderWidth: 1}}
                            placeholder="Novo Item"
                            value={state.newItemDescription}
                            onChangeText={(text) => {this.setState({newItemDescription: text})}}
                        />
                        <Button title="+" onPress={this.createListItem} color="green" />
                    </View>
                    <FlatList
                        style={{flex: 1}}
                        data={list.body.items}
                        keyExtractor={this.keyExtractor}
                        renderItem={({item}) => <ListItem item={item} onUpdate={this.updateListItem} onRemove={this.removeListItem} />}
                    />
                </ScrollView>
                <Button title="Salvar" onPress={() => {this.props.onActionDone(list)}} />
            </SafeAreaView>
        )
    }
}

export default List;