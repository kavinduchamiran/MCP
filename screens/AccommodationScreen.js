import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {
    Image,
    ScrollView,
    Picker,
    StyleSheet,
    SafeAreaView,
    View,
    Dimensions,
    Text,
    TextInput,
    Platform,
    StatusBar
} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button} from 'react-native-elements';
import store from '../store/store'

const addUserAction = user => {
    console.log(store.getState())
    return {...user, ...{type: "accommodation"}}
    //dispatch(input)
}
// const mapDispatchToProps = dispatch => (
//     bindActionCreators({
//         addUserAction,
//     }, dispatch)
// );


// const handleSubmit = () => {
//     console.log("handle submit")
//     let action = addUserAction(User)
// }

//check if User need to be reinitiated
// var User = {}
// const this.addFeature = (feature) => {
//     User = {...User, ...feature}
//     //console.log("User", User)
// }

class accommodation extends React.Component {
    constructor(props) {
        super(props);
        const {dispatch} = props;
        this.boundActionCreators = bindActionCreators(addUserAction, dispatch);
        console.log(this.boundActionCreators)
    }

    state = {
        image: null,
        pickerValue: ''
    };

    User = {};
    addFeature = (feature) => {
        this.User = {...this.User, ...feature}
    };

    handleSubmit() {
        // Injected by react-redux:
        let {dispatch} = this.props;
        // Note: this won't work:
        // TodoActionCreators.addTodo('Use Redux')
        // You're just calling a function that creates an action.
        // You must dispatch the action, too!
        // This will work:
        let action = addUserAction(this.User);
        dispatch(action);
        console.log(store.getState())
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
    };

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
        let {image} = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.item1}>
                        <Text style={styles.text}>Accommodation Sign up</Text>
                    </View>
                    <View style={styles.item2}>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={this.state.pickerValue}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({pickerValue: itemValue})
                                }>
                                <Picker.Item label="    SELECT TYPE" value=""/>
                                <Picker.Item label="HOTEL" value="HOTEL"/>
                                <Picker.Item label="MODEL" value="MODEL"/>
                                <Picker.Item label="INN" value="INN"/>
                                <Picker.Item label="HOSTEL" value="HOSTEL"/>
                                <Picker.Item label="BNB" value="BNB"/>
                            </Picker>
                        </View>
                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Establishment Name'}
                            onChangeText={text => {
                                this.addFeature({name: text})
                            }}
                        />
                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Capacity'}
                            keyboardType={"numeric"}
                            onChangeText={text => {
                                this.addFeature({capacity: text})
                            }}
                        />
                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Address'}
                            onChangeText={text => {
                                this.addFeature({address: text})
                            }}
                        />
                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Telephone'}
                            keyboardType={"numeric"}
                            onChangeText={text => {
                                this.addFeature({telephone: text})
                            }}
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
                            titleStyle={styles.ButtonTitle}
                            title="    Continue"
                            icon={() => <FontAwesome name="long-arrow-right" size={25} style={{color: 'white'}}/>}
                            onPress={() => {
                                //Alert.alert('Simple Button pressed')
                                console.log(" Added User Details")
                                console.log("image link : ", this.state.image)
                                this.handleSubmit()
                            }}
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
        marginTop: 10,
        marginBottom: 80,
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 80 : 0,
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
        alignItems: 'center'
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

const AccommodationScreen = connect()(accommodation);

export default AccommodationScreen;
