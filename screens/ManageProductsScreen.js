import React from 'react';
import {
    Text,
    View,
    Button,
    StatusBar,
    AsyncStorage, Platform, Alert
} from 'react-native';
import Constants from "expo-constants";
import * as Location from "expo-location";

import { app } from '../services/firebase-service';

import firebase from 'firebase/app';
import 'firebase/firestore';
import * as Permissions from "expo-permissions";

const dbh = firebase.firestore(app);

export default class ManageProductsScreen extends React.Component {
    handleLogout = async () => {
        await AsyncStorage.clear();
        console.log('cleared');

        this.props.navigation.navigate('AuthLoading');
    };

    handleViewMyChats = async () => {
        const response = await fetch(`${BASE_URL}/user/getUser`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: AuthUser.id,
            })
        });

        const {user, status, errors} = await response.json();

        if (status) {
            this.props.navigation.navigate('Chat', {
                selectedUserId: user.chatId,
                id: AuthUser.id,
                name: AuthUser.name
            });
        }else{
            Alert.alert(
                'Unexpected error',
                errors,
                [{
                    text: 'OK'
                }]
            );
        }
    };

    handleViewMyProduct = () => {
        Alert.alert('Under construction');
    };

    componentDidMount() {
        this.setState({
            ...AuthUser
        });

        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                error: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }

        this.pushLocation = Location.watchPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
        }, async l => {
            let data = {
                name: this.state.name,
                type: this.state.type,
                available: true,
                latitude: l.coords.latitude,
                longitude: l.coords.longitude
            };

            try {
                await dbh.collection('location').doc(this.state.id).set(data);
            }catch (e) {
                console.log(e);
            }
        });
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };

    render() {
        const {navigation} = this.props;
        const {id, type} = AuthUser;

        return (
            <View style={{flex: 1, flexDirection: 'column', paddingTop: StatusBar.currentHeight}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1,  alignItems: 'center', justifyContent: 'center', backgroundColor: 'red'}}>
                        <Button
                            title='View my product'
                            onPress={this.handleViewMyProduct}
                        />
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green'}}>
                        <Button
                            title='Add product'
                            onPress={() => navigation.navigate(type === 'TRA' ? 'Transportation' : 'Accommodation')}
                        />
                    </View>
                </View>

                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'pink'}}>
                        <Button
                            title='View my chats'
                            onPress={this.handleViewMyChats}
                        />
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'yellow'}}>
                        <Button
                            title='Log out'
                            onPress={this.handleLogout}
                        />
                    </View>
                </View>
            </View>
        );
    }

    componentWillUnmount() {
        this.pushLocation();
    }
}
