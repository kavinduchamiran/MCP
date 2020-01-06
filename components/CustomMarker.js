import React, { Component } from 'react';
import { Image } from 'react-native';

export default class CustomMarker extends Component {
    render() {
        return (
            <Image
                style={styles.Marker}
                source={require('../assets/user.png')}
            />
        );
    }
}

const styles = {
    Marker: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "red"
    }
};
