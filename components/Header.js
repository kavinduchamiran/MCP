import React from 'react';
import { View, Text } from 'react-native';

const Header = (props) => {

    return (
        <View style={styles.header}>
            {props.children}
            <Text style={styles.header_text}>{props.text}</Text>
        </View>
    );

}

styles = {
    header: {
        flex: 0.5,
        padding: 10,
        backgroundColor: '#393939',
        marginTop: 23,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    header_text: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#FFF',
        marginLeft: 10
    },
}

export default Header;
