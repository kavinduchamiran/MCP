import React, {Component} from "react";
import {Text, View} from "react-native";

export default class CircledNumber extends Component {
    render() {
        return (
            <View style={{flexDirection: 'row', marginLeft: this.props.start ? 0 : 20}}>
                <Text style={{
                    borderColor: this.props.active ? '#17BA4D': '#EEEEEE',
                    borderWidth: 2,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: 24,
                    marginTop: 5
                }}>{this.props.children}</Text>

                {!this.props.end &&
                <View
                    style={{
                        // borderBottomColor: '#EEEEEE',
                        // borderBottomWidth: 5,
                        width: 65,
                        alignSelf: 'center',
                        top: 5,
                        marginHorizontal: 10
                    }}
                />}
            </View>
        );
    }
};
