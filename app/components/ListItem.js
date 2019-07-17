import React, { Component } from 'react';
import { View, TextInput, Switch, Button } from 'react-native';


class ListItem extends Component{
    static defaultProps = {
        item: {},
        onUpdate: () => {},
        onRemove: () => {}
    }

    updateItem = (field, value) => {
        const newItem = Object.assign({}, this.props.item, {[field]: value});
        this.props.onUpdate(newItem);
    }
    removeItem = () => {
        this.props.onRemove(this.props.item);
    }

    render(){
        const {props} = this,
            {item} = props;
        return(
            <View style={{flex: 1, flexDirection: 'row'}} >
                <Switch 
                    value={item.done}
                    onValueChange={(done) => this.updateItem('done', done)}
                />
                <TextInput 
                    style={{flex: 1, height: 40, borderColor: 'gray', borderWidth: 1}}
                    placeholder="Descricao"
                    value={item.description}
                    onChangeText={(text)=>this.updateItem('description', text)}
                    editable={!item.done}
                />
                <Button title="X" onPress={this.removeItem} color="red" />
            </View>
        )
    }
}

export default ListItem;