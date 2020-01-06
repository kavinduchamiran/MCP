import React from 'react';
import {
    ScrollView,
    Picker,
    StyleSheet,
    SafeAreaView,
    View,
    Platform,
    Text,
    TextInput,
    StatusBar,
    Image, Alert
} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {Button, SocialIcon} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as FileSystem from "expo-file-system";

export default class Transport extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        image: null,
    };

    async handleSubmit() {
        this.setState({isFetching: true});

        try {
            const {uri} = await FileSystem.getInfoAsync(this.state.image);

            const formData = new FormData();
            formData.append('image', {
                uri,
                type: 'image/jpeg',
                name: `${Date.now()}.jpg`
            });

            const response = await fetch(`${BASE_URL}/transportation/createTransportation`, {
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'ownerid': AuthUser.id.toString(),
                    'type': this.state.type.toString(),
                    'seats': this.state.seats,
                    'vehicleNumber': this.state.vehicleNumber.toString(),
                    'driverContact': this.state.driverContact.toString()
                },
                body: formData
            });

            const {status, transportationId, errors} = await response.json();

            if (!status){
                Alert.alert(
                    'Error saving transportation',
                    errors,
                    [{
                        text: 'OK'
                    }]
                );
            }else{
                AuthUser.transportationId = transportationId;

                Alert.alert(
                    'Saving complete',
                    'Your transportation has been saved successfully!',
                    [{
                        text: 'OK'
                    }]
                );
            }
        } catch (error) {
            Alert.alert(
                'Error saving transportation',
                error.message,
                [{
                    text: 'OK'
                }]
            );
            console.log(error)
        }

        // set isFetching to false so the UI can properly react on that
        this.setState({isFetching: false})
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            this.setState({image: result.uri});
        }
    };

    render() {
        let {image, type, seats, vehicleNumber} = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.item1}>
                        <Text style={styles.text}>Transportation Sign up</Text>
                    </View>
                    <View style={styles.item2}>
                        <View style={styles.picker}>
                            <Picker
                                style={styles.TextBoxStyle}
                                onValueChange={(type, itemIndex) => this.setState({type})}
                                selectedValue={this.state.type}
                            >
                                <Picker.Item label="    SELECT TYPE" value=""/>
                                <Picker.Item label="CAR" value="CAR"/>
                                <Picker.Item label="VAN" value="VAN"/>
                                <Picker.Item label="TRUCK" value="TRUCK"/>
                                <Picker.Item label="JEEP" value="JEEP"/>
                                <Picker.Item label="SUV" value="SUV"/>
                            </Picker>
                        </View>

                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Number of seats'}
                            keyboardType={"numeric"}
                            onChangeText={seats => this.setState({seats})}
                        />

                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Vehicle Number'}
                            onChangeText={vehicleNumber => this.setState({vehicleNumber})}
                        />

                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Driver contact number'}
                            keyboardType={"numeric"}
                            onChangeText={driverContact => this.setState({driverContact})}
                        />

                        <View>
                            <Button
                                buttonStyle={styles.Button2}
                                titleStyle={styles.ButtonTitle2}
                                title="Upload Image from Gallery"
                                onPress={() => {
                                    this._pickImage()
                                }
                                }
                            />
                            {image &&

                            <Image source={{uri: image}} style={{width: 200, height: 200}}/>}
                        </View>
                    </View>

                    <View style={styles.item3}>
                        <Button
                            buttonStyle={{
                                backgroundColor: '#31C261',
                            }}
                            disabled={!(type && seats && vehicleNumber && image)}
                            title="   Add new transportation"
                            icon={() => <FontAwesome name="long-arrow-right" size={25} style={{color: 'white'}}/>}
                            onPress={() => this.handleSubmit()}
                        />

                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = {
    picker: {
        height: 40,
        width: '80%',
        backgroundColor: '#00FF7F',
        borderColor: '#17BA4D',
        // placeholderTextColor: '#97A19A',
        borderRadius: 4,
        borderWidth: 2,
        marginVertical: 10,
        justifyContent: 'center'
    },
    Button2: {
        height: 40,
        width: '100%',
        backgroundColor: '#00FF7F',
        borderColor: '#17BA4D',
        // placeholderTextColor: '#97A19A',
        borderRadius: 4,
        borderWidth: 2,
        marginVertical: 10,
        justifyContent: 'center'
    },
    TextBoxStyle: {
        height: 40,
        width: '100%',
        borderColor: '#17BA4D',
        // placeholderTextColor: '#97A19A',
        borderRadius: 4,
        borderWidth: 2,
        marginVertical: 10
    },
    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 50 : 0,
        flex: 1,
        backgroundColor: "#fff"
    },
    text: {
        fontFamily: 'sofiapro-light',
        fontWeight: "bold",
        fontSize: 20
    },
    item1: {
        flex: 1,
        // backgroundColor: "#feffcb",
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item2: {
        flex: 2,
        width: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        left: '10%',
        // backgroundColor: "#c6394d"
    },
    item3: {
        flex: 2,
        // backgroundColor: "#49beb7",
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    ButtonTitle: {
        color: 'white',
        fontFamily: 'sofiapro-light',
        fontWeight: '400',
        fontSize: 16
    },
    ButtonTitle2: {
        color: 'black',
        fontFamily: 'sofiapro-light',
        fontWeight: '400',
        fontSize: 16
    },
    item4: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
        // backgroundColor: "#240041"
    }
};
