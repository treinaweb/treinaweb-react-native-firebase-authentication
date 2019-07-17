import React, {Component} from 'react';
import {View, Text, Image, Dimensions, TouchableHighlight} from 'react-native';

class SimpleList extends Component{
    static defaultProps = {
        list: {},
        onSelect: () => {},
        onRemove: () => {}
    }
    render(){
        const  {props} = this,
            {list} = props,
            {width} = Dimensions.get('window'),
            picture = list.body.picture || 'http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png';
        return (
            <TouchableHighlight onPress={props.onSelect} style={{width: (width/3 - 8), margin: 2, marginBottom: 30, borderWidth: 1, borderColor: '#aaa', padding: 5}} >
                <View style={{position: 'relative'}} >
                    <TouchableHighlight onPress={() => {props.onRemove(props.list)}} style={{position: 'absolute', right: 0, top: 0, zIndex: 2}} >
                        <Text style={{backgroundColor: 'red', color: 'white', padding: 5}} >X</Text>
                    </TouchableHighlight>
                    <Image source={{uri: picture}} style={{height: width/3-8}} />
                    <Text style={{fontWeight: 'bold'}} >{list.body.title}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

export default SimpleList;