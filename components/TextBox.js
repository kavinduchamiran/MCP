import React, { Component } from 'react';
import { TextInput } from 'react-native';


export default class TextBox extends Component {
    fieldRef = React.createRef();

    onChangeText = () => {
        let { current: field } = this.fieldRef;

        console.log(field.value());
    };

    formatText = (text) => {
        return text.replace(/[^+\d]/g, '');
    };

    render() {
        return (
            <TextInput
                style={styles.TextBoxStyle}
                onChangeText={text => this.onChangeText}
                placeholder={'   ' +  this.props.placeholder}
                secureTextEntry={this.props.secureTextEntry}
            />
        );
    }
}

const styles = {
    TextBoxStyle: {
        height: 40,
        width:'100%',
        borderColor: '#17BA4D',
        // placeholderTextColor: '#97A19A',
        borderRadius: 4,
        borderWidth: 2,
        marginVertical: 10
    },
};
