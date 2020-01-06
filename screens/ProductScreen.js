import React from 'react';
import {View, Text, SafeAreaView, Dimensions, Platform, StyleSheet, Button, Linking} from 'react-native';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

const { width: screenWidth } = Dimensions.get('window');

export default class ProductScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'View product'
        }
    };

    rad (x) {
        return x * Math.PI / 180;
    };

     getDistance(p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.latitude - p1.latitude);
        var dLong = this.rad(p2.longitude - p1.longitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.latitude)) * Math.cos(this.rad(p2.latitude)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return (d/1000).toFixed(2); // returns the distance in meter
    };

    state = {

    };

    async fetchTransportInfo(userId) {
        const response = await fetch(`${BASE_URL}/transportation/getTransportationByUser`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId
            })
        });

        const {status, owner, transportation} = await response.json();

        if (status) {
            const {_id, type, seats, vehicleNumber, driver, driverContact, verified} = transportation;
            const {name} = owner;

            this.setState({
                transportationId: _id, type, seats, vehicleNumber, driver, tel: driverContact, verified, name
            })
        }
    }

    async componentDidMount() {
        const {navigation} = this.props;

        let {duration, filter, id, location, name, selectedUserId, value, destination} = navigation.state.params;

        this.setState({
            transportationId: selectedUserId,
            source: location.coords,
            destination: destination,
            distance: this.getDistance(location.coords, destination)
        });

        await this.fetchTransportInfo(selectedUserId);
    }

    _renderItem ({item, index}, parallaxProps) {
        return (
            <View style={styles.item}>
                <ParallaxImage
                    source={{ uri: item.illustration }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
                <Text style={styles.title} numberOfLines={2}>
                    { item.title }
                </Text>
            </View>
        );
    }

    handleContinue = () => {
        const {selectedUserId, name, id, filter, value, duration, location, destination} = this.props.navigation.state.params;

        this.props.navigation.navigate('Chat', {selectedUserId, name, id, filter, value, duration, location, destination})
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>
                    <Carousel
                        sliderWidth={screenWidth}
                        sliderHeight={screenWidth}
                        itemWidth={screenWidth - 60}
                        data={[
                            {
                                illustration: `${BASE_URL}/static/transportation/${this.state.transportationId}/0.jpg`
                            }
                        ]}
                        renderItem={this._renderItem}
                        hasParallaxImages={true}
                    />
                </View>

                <View style={{flex: 2, backgroundColor: 'yellow', flexDirection: 'column'}}>
                    <Text style={{marginVertical: 10, fontSize: 25, marginHorizontal: 10}}>
                        Type: {this.state.type} {'\n'}
                        Distance: {this.state.distance} {'KM\n'}
                        Owner: {this.state.name} {'\n'}
                        Capacity: {this.state.seats} {'\n'}
                        Verified: {String(this.state.verified)}
                    </Text>
                    <View style={{paddingTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{marginRight: 35}}>
                            <Button
                                onPress={() => Linking.openURL(`tel:${this.state.tel}`)}
                                title={'Contact driver'}
                                disabled={!this.state.tel}
                            />
                        </View>

                        <View style={{marginLeft: 35}}>
                            <Button onPress={() => this.handleContinue()} title={'Continue'} />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = {
    item: {
        width: screenWidth - 60,
        height: screenWidth - 60,
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
}
