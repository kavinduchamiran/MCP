import React from 'react';
import {Dimensions, View, Text, Platform, Picker, SafeAreaView, Button} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import RadioForm from 'react-native-simple-radio-button';
import { Dropdown } from 'react-native-material-dropdown';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { app } from '../services/firebase-service';

import CustomMarker from "../components/CustomMarker";

import firebase from 'firebase/app';
import 'firebase/firestore';

const dbh = firebase.firestore(app);

export default class HomeScreen extends React.Component {
    state = {
        location: null,
        error: null,
        markers: {},
        label: 'Vehicle type',
        types: [
            // defaults to transportation
            {value: 'Car'},
            {value: 'Van'},
            {value: 'Truck'},
            {value: 'Jeep'},
            {value: 'SUV'},
        ],
        duration: 1,
        filter: 'TRA',
        value: 'Car'
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

        // pull location updates
        let query = dbh.collection('location')
            .where('available', '==', true);

        this.pullLocation = query.onSnapshot(querySnapshot => {
            let newMarkers = {};
            querySnapshot.forEach(doc => {
                newMarkers[doc.id] = doc.data();
            });
            this.setState({markers: newMarkers});
        }, err => {
            console.log(`Encountered error: ${err}`);
        });

        // push location updates
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

    componentWillUnmount() {
        this.pullLocation();
        this.pushLocation();
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

        this.setMapLocation(location);
    };

    setMapLocation = (location) => {
        let r = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        };

        this.mapView.animateToRegion(r, 2000);
    };

    render() {
        // todo filtering markers when selecting

        const {navigation} = this.props;
        const {markers} = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <View style={{flex: 4}}>
                    <MapView
                        ref = {(ref)=>this.mapView=ref}
                        style={styles.mapStyle}
                        provider={MapView.PROVIDER_GOOGLE}
                        showsUserLocation={false}
                        showsMyLocationButton={false}
                    >

                        {markers && Object.keys(markers).map((keyName, i) => {
                            const info = markers[keyName];

                            if (this.state.filter !== info.type)
                                return;

                            if (this.state.id === keyName)
                                return;

                            return (
                                <Marker
                                    key={keyName}
                                    coordinate={info}
                                    identifier={keyName}
                                    onPress={e => this.setState({selectedMarker: e.nativeEvent.id})}
                                >
                                    <CustomMarker/>
                                    <Callout>
                                        <View style={{width: 100}}>
                                            {/* todo rating */}
                                            <Text>{info.name}</Text>
                                        </View>
                                    </Callout>
                                </Marker>
                            );
                        })}
                    </MapView>
                </View>

                <View style={{flex: 1, flexDirection: "column", backgroundColor: 'yellow'}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: "flex-start", justifyContent: "center"}}>
                        <View style={{marginHorizontal: 5}} />
                        <View style={{flex: 1}}>
                            <Dropdown
                                label="I'm looking for"
                                value={'Transportation'}
                                data={[{
                                    value: 'Transportation'
                                }, {
                                    value: 'Accommodation'
                                }, {
                                    value: 'Hangout'
                                }]}
                                onChangeText={x => {
                                    if (x === 'Transportation'){
                                        this.setState({
                                            filter: 'TRA',
                                            value: 'Car',
                                            label: 'Vehicle type',
                                            types: [
                                                {value: 'Car'},
                                                {value: 'Van'},
                                                {value: 'Truck'},
                                                {value: 'Jeep'},
                                                {value: 'SUV'},
                                            ]
                                        })
                                    }else if (x === 'Accommodation'){
                                        this.setState({
                                            filter: 'ACC',
                                            value: 'Hotel',
                                            label: 'Hotel type',
                                            types: [
                                                {value: 'Hotel'},
                                                {value: 'Motel'},
                                                {value: 'Inn'},
                                                {value: 'Hostel'},
                                                {value: 'BnB'},
                                            ]
                                        })
                                    }else if (x === 'Hangout'){
                                        this.setState({
                                            filter: 'HAN',
                                            value: 'English',
                                            label: 'Language',
                                            types: [
                                                {value: 'English'},
                                                {value: 'Sinhalese'},
                                                {value: 'Tamil'},
                                                {value: 'French'},
                                            ]
                                        })
                                    }
                                }}
                            />
                        </View>
                        <View style={{marginHorizontal: 10}} />
                        <View style={{flex: 1}}>
                            <Dropdown
                                label={this.state.label}
                                value={this.state.value}
                                data={this.state.types}
                                onChangeText={value => this.setState({value})}
                            />
                        </View>
                        <View style={{marginHorizontal: 5}} />
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                        <RadioForm
                            formHorizontal={true}
                            labelHorizontal={true}
                            animation={true}
                            radio_props={[
                                {label: '1 day    ', value: 1 },
                                {label: '3 days    ', value: 3 },
                                {label: '7 days    ', value: 7 }
                            ]}
                            initial={0}
                            onPress={(duration) => this.setState({duration})}
                        />
                    </View>
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <Button
                            title={'Continue'}
                            disabled={!this.state.selectedMarker}
                            onPress={() => {
                                navigation.navigate(this.state.filter === 'HAN' ? 'Chat' : 'Product', {
                                    selectedUserId: this.state.selectedMarker,
                                    name: this.state.name,
                                    id: this.state.id,
                                    filter: this.state.filter,
                                    value: this.state.value,
                                    duration: this.state.duration,
                                    location: this.state.location,
                                    destination: this.state.markers[this.state.selectedMarker]
                                })
                            }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: '100%' //Dimensions.get('window').height,
    },
};
