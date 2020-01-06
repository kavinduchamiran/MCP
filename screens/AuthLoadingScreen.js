import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
    async componentDidMount() {
        this._bootstrapAsync();

        // todo force logout
        // await AsyncStorage.clear();
        // console.log('cleared');
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        const {navigation} = this.props;

        global.AuthUser = user;

        navigation.navigate(user && user.token ? user.type : 'Auth');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
