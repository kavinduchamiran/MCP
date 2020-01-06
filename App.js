import React from 'react';
import {Platform, InteractionManager, Button} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Asset } from "expo-asset";
import * as Font from 'expo-font';
import {AppLoading} from 'expo';

import { app } from './services/firebase-service';

import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import TransportScreen from "./screens/TransportScreen";
import AccommodationScreen from "./screens/AccommodationScreen";
import ChatScreen from "./screens/ChatScreen";
import ProductScreen from "./screens/ProductScreen";
import ManageProductsScreen from "./screens/ManageProductsScreen";

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;

global.BASE_URL = 'http://f44e4ef4.ngrok.io';

function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
}

function cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
}

const HanNavigator = createStackNavigator({
    Home: {
        navigationOptions: {
            header: null,
        },
        screen: HomeScreen,
    },

    Chat: {
        screen: ChatScreen,
        navigationOptions: {
            headerTitle: 'Chat'
        }
    },

    Product: {
        screen: ProductScreen,
    },
}, {
    initialRouteName: 'Home',
});

const TraNavigator = createStackNavigator({
    Transportation: {
        screen: TransportScreen,
        navigationOptions: {
            headerTitle: 'Add transportation product'
        }
    },

    Product: {
        screen: ProductScreen,
    },

    Chat: {
        screen: ChatScreen,
        navigationOptions: {
            headerTitle: 'Chat'
        }
    },

    ManageProducts: {
        screen: ManageProductsScreen,
        navigationOptions: {
            header: null,
        }
    },
}, {
    // todo managepro
    initialRouteName: 'ManageProducts'
});

const AccNavigator = createStackNavigator({
    Accommodation: {
        screen: AccommodationScreen,
        navigationOptions: {
            headerTitle: 'Add accommodation product'
        }
    },

    Chat: {
        screen: ChatScreen,
        navigationOptions: {
            headerTitle: 'Chat'
        }
    },

    ManageProducts: {
        screen: ManageProductsScreen,
        navigationOptions: {
            header: null,
        }
    },
}, {
    initialRouteName: 'ManageProducts',
});

const AuthNavigator = createStackNavigator({
    Register: {
        screen: RegisterScreen,
        navigationOptions: {
            header: null,
        }
    },

    Login: {
        screen: LoginScreen,
        navigationOptions: {
            header: null,
        }
    },
},{
    // todo login
    initialRouteName: 'Login',
});

const AppContainer = createAppContainer(
    createSwitchNavigator({
        AuthLoading: AuthLoadingScreen,
        Auth: AuthNavigator,
        HAN: HanNavigator,
        TRA: TraNavigator,
        ACC: AccNavigator
    }, {
        initialRouteName: 'AuthLoading'
    })
);

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            isReady: false
        };
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            const timerFix = {};
            const runTask = (id, fn, ttl, args) => {
                const waitingTime = ttl - Date.now();
                if (waitingTime <= 1) {
                    InteractionManager.runAfterInteractions(() => {
                        if (!timerFix[id]) {
                            return;
                        }
                        delete timerFix[id];
                        fn(...args);
                    });
                    return;
                }

                const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
                timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
            };

            global.setTimeout = (fn, time, ...args) => {
                if (MAX_TIMER_DURATION_MS < time) {
                    const ttl = Date.now() + time;
                    const id = '_lt_' + Object.keys(timerFix).length;
                    runTask(id, fn, ttl, args);
                    return id;
                }
                return _setTimeout(fn, time, ...args);
            };

            global.clearTimeout = id => {
                if (typeof id === 'string' && id.startsWith('_lt_')) {
                    _clearTimeout(timerFix[id]);
                    delete timerFix[id];
                    return;
                }
                _clearTimeout(id);
            };
        }
    }

    async _loadAssetsAsync() {
        const imageAssets = cacheImages([
            require('./assets/auth.jpg'),
        ]);

        const fontAssets = cacheFonts([
            {
                'sofiapro-light': require('./assets/fonts/sofiapro-light.otf'),
            }
        ]);


        await Promise.all([...imageAssets, ...fontAssets]);
    }

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    startAsync={this._loadAssetsAsync}
                    onFinish={() => this.setState({ isReady: true })}
                    onError={console.warn}
                />
            );
        }

        return (
            <AppContainer/>
        );
    }
}
