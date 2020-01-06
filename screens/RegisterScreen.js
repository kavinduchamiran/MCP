import React from 'react';
import {
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    Platform,
    Vibration,
    ActivityIndicator, Alert
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import {FontAwesome} from '@expo/vector-icons';
import {Dropdown} from 'react-native-material-dropdown';
import RadioForm from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker'

import RegistrationSteps from "./RegistrationSteps";

let verificationTexts = {
    EN: 'Times Square is the hub of the Broadway theatre district and a major cultural venue in Midtown Manhattan, New York City. The pedestrian intersection also have one of the highest annual attendance-rates of any tourist attraction in the world, estimated at 60 million.',
    DU: 'Times Square is het centrum van het theaterdistrict Broadway en een belangrijke culturele locatie in Midtown Manhattan, New York City. De voetgangersoversteekplaats heeft ook een van de hoogste jaarlijkse bezoekerspercentages van alle toeristische attracties ter wereld, geschat op 60 miljoen.',
    IT: 'Times Square è il fulcro del quartiere dei teatri di Broadway e un\'importante sede culturale a Midtown Manhattan, New York City. L\'incrocio pedonale ha anche uno dei più alti tassi di frequenza annuale di qualsiasi attrazione turistica nel mondo, stimato in 60 milioni.',
    FR: 'Times Square est le centre du quartier des théâtres de Broadway et un lieu culturel majeur à Midtown Manhattan, à New York. L\'intersection piétonne présente également l\'un des taux de fréquentation annuels les plus élevés de toutes les attractions touristiques au monde, estimé à 60 millions.'
};

let userTypes = [
    {value: 'Hangout'},
    {value: 'Accommodation'},
    {value: 'Transportation'}
];

let gender = [
    {value: 'Male'},
    {value: 'Female'},
    {value: 'Other'}
];

let nationality = [
    {value: 'AU'},
    {value: 'US'},
    {value: 'UK'}
];

let languages = [
    {label: 'Dutch', value: 'DU'},
    {label: 'English', value: 'EN'},
    {label: 'Italiano', value: 'IT'},
    {label: 'French', value: 'FR'},
];

let languagesReverse = {
    'DU': 0,
    'EN': 1,
    'IT': 2,
    'FR': 3
};

const recordingOptions = {
    android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
};

export default class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.recording = null;
        this.state = {
            birthday: "1995-02-10",
            type: 'Hangout',
            gender: 'Male',
            nationality: 'AU',
            language: 'DU',
            isRecording: false,
        }
    }

    startRecording = async () => {
        Vibration.vibrate();

        // request permissions to record audio
        const {status} = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        // if the user doesn't allow us to do so - return as we can't do anything further :(
        if (status !== 'granted') return;
        // when status is granted - setting up our state
        this.setState({isRecording: true});

        // basic settings before we start recording,
        // you can read more about each of them in expo documentation on Audio
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true
        })
        const recording = new Audio.Recording()
        try {
            // here we pass our recording options
            await recording.prepareToRecordAsync(recordingOptions)
            // and finally start the record
            await recording.startAsync()
        } catch (error) {
            console.log(1, error)
            // we will take a closer look at stopRecording function further in this article
            this.stopRecording()
        }

        // if recording was successful we store the result in variable,
        // so we can refer to it from other functions of our component
        this.recording = recording
    };

    stopRecording = async () => {
        // set our state to false, so the UI knows that we've stopped the recording
        this.setState({isRecording: false})
        try {
            // stop the recording
            await this.recording.stopAndUnloadAsync()
        } catch (error) {
            console.log(error)
        }
    };

    getTranscription = async () => {
        // set isFetching to true, so the UI knows about it
        this.setState({isFetching: true});
        try {
            // take the uri of the recorded audio from the file system
            const {uri} = await FileSystem.getInfoAsync(this.recording.getURI());
            // now we create formData which will be sent to our backend
            const formData = new FormData();
            formData.append('audio', {
                uri,
                // as different audio types are used for android and ios - we should handle it
                type: Platform.OS === 'ios' ? 'audio/x-wav' : 'audio/m4a',
                name: Platform.OS === 'ios' ? `${Date.now()}.wav` : `${Date.now()}.m4a`,
            });
            // post the formData to our backend
            const response = await fetch(`${BASE_URL}/user/verifyLanguage`, {
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'language': this.state.language.toString(),
                    'userId': userId.toString(),
                },
                body: formData
            });

            const {status, verified, errors} = await response.json();

            if (!status){
                Alert.alert(
                    'Verification error',
                    errors,
                    [{
                        text: 'OK'
                    }]
                );
            }else{
                if (verified) {
                    Alert.alert(
                        'Verification complete',
                        'Please login with your credentials',
                        [{
                            text: 'OK'
                        }]
                    );

                    this.props.navigation.navigate('Login');
                }else{
                    Alert.alert(
                        'Registration error',
                        'Verification failed',
                        [{
                            text: 'OK'
                        }]
                    );
                }
            }
        } catch (error) {
            Alert.alert(
                'Voice recording error',
                error.message,
                [{
                    text: 'OK'
                }]
            );

            this.stopRecording();
            // we will take a closer look at resetRecording function further down
            this.resetRecording();
        }
        // set isFetching to false so the UI can properly react on that
        this.setState({isFetching: false})
    };

    deleteRecordingFile = async () => {
        // deleting file
        try {
            const info = await FileSystem.getInfoAsync(this.recording.getURI())
            await FileSystem.deleteAsync(info.uri)
        } catch (error) {
            console.log('There was an error deleting recorded file', error)
        }
    }

    resetRecording = () => {
        this.deleteRecordingFile()
        this.recording = null
    }


    handleOnPressOut = () => {
        Vibration.vibrate();

        // first we stop the recording
        this.stopRecording();
        // second we interact with our backend
        this.getTranscription();
    }

    render() {
        const {navigate} = this.props.navigation;

        const loginHandler = () => navigate('Login');

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                        height: 80,
                        paddingTop: 38,
                        textAlign: 'center',
                        // backgroundColor: '#f43',
                        fontSize: 30
                    }}>Sign Up</Text>

                    <View style={styles.item2}>
                        <RegistrationSteps>
                            <RegistrationSteps.Step
                                oneDisabled={this.state.name && this.state.email && this.state.password && this.state.password.length > 7 && this.state.password === this.state.password2}
                                screen={1}
                            >
                                <TextInput
                                    style={styles.input}
                                    placeholder={'Name'}
                                    value={this.state.name}
                                    onChangeText={name => this.setState({name})}
                                />
                                <TextInput
                                    textContentType={"emailAddress"}
                                    keyboardType={"email-address"}
                                    style={styles.input}
                                    placeholder={'Email'}
                                    value={this.state.email}
                                    onChangeText={email => this.setState({email})}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder={'Password'}
                                    secureTextEntry
                                    value={this.state.password}
                                    onChangeText={password => this.setState({password})}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder={'Confirm password'}
                                    secureTextEntry
                                    value={this.state.password2}
                                    onChangeText={password2 => this.setState({password2})}
                                />
                            </RegistrationSteps.Step>

                            <RegistrationSteps.Step
                                twoDisabled={this.state.type && this.state.gender && this.state.birthday && this.state.nationality && this.state.language}
                                screen={2}
                                user={this.state}
                            >

                                <Dropdown
                                    label='User Type'
                                    data={userTypes}
                                    animationDuration={200}
                                    value={this.state.type}
                                    onChangeText={type => this.setState({type})}
                                />

                                <Dropdown
                                    label={'Gender'}
                                    data={gender}
                                    animationDuration={200}
                                    value={this.state.gender}
                                    onChangeText={gender => this.setState({gender})}
                                />

                                <View style={{
                                    flexDirection: 'column',
                                    marginTop: 10,
                                    // backgroundColor: '#31C161',
                                    alignItems: 'flex-start',
                                    // justifyContent: 'center',
                                }}>
                                    <Text>Birthday</Text>

                                    <DatePicker
                                        style={{width: 200, marginTop: 10}}
                                        date={this.state.birthday}
                                        mode="date"
                                        placeholder="select date"
                                        format="YYYY-MM-DD"
                                        minDate="1950-01-01"
                                        maxDate="2020-01-01"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0
                                            },
                                            dateInput: {
                                                marginLeft: 36
                                            }
                                        }}
                                        onDateChange={(birthday) => {
                                            this.setState({birthday})
                                        }}
                                    />
                                </View>

                                <Dropdown
                                    label={'Nationality'}
                                    data={nationality}
                                    animationDuration={200}
                                    value={this.state.nationality}
                                    onChangeText={nationality => this.setState({nationality})}
                                />

                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    // backgroundColor: '#31C161',
                                    // alignItems: 'center',
                                    // justifyContent: 'center',
                                    width: '100%'
                                }}>
                                    <Text style={{flex: 2, marginEnd: 5}}>Language</Text>
                                    <View style={{flex: 3}}>
                                        <RadioForm
                                            initial={languagesReverse[this.state.language]}
                                            radio_props={languages}
                                            onPress={language => this.setState({language})}
                                            buttonColor={'#31C161'}
                                            buttonInnerColor={'#31C161'}
                                            selectedButtonColor={'#31C161'}
                                        />
                                    </View>
                                </View>
                            </RegistrationSteps.Step>

                            <RegistrationSteps.Step
                                screen={3}
                            >
                                {this.state.isFetching ?
                                    <View style={{alignItems: 'center'}}>
                                        <Text
                                            style={{marginTop: 20, fontSize: 25}}
                                        >
                                            Processing...
                                        </Text>

                                        <ActivityIndicator size={'large'} />
                                    </View>
                                    :
                                    <View>
                                        <Text
                                            style={{fontSize: 15}}
                                        >
                                            Please hold the button and read the following text to verify that you
                                            speak {this.state.language}
                                        </Text>

                                        <Text
                                            style={{marginTop: 20, fontSize: 20}}
                                        >
                                            {verificationTexts[this.state.language]}
                                        </Text>

                                        <TouchableOpacity
                                            onPressIn={this.startRecording}
                                            onPressOut={this.handleOnPressOut}
                                            style={{alignItems: 'center', marginTop: 15}}
                                        >

                                            <FontAwesome name="microphone" size={45} style={{color: 'black'}}/>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </RegistrationSteps.Step>
                        </RegistrationSteps>

                    </View>

                    <View style={styles.item4}>
                        <Text style={styles.text}>Already have an account? </Text>
                        <TouchableOpacity onPress={loginHandler}>
                            <Text style={{...styles.text, color: '#31C161', fontWeight: "bold"}}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    text: {
        fontFamily: 'sofiapro-light',
        fontWeight: "bold",
        fontSize: 20
    },
    dropBox: {
        flex: 1,
        // backgroundColor: "#feffcb",
        width: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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
        flex: 4,
        width: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        left: '10%',
        // marginBottom: 100,
        // backgroundColor: "green"
    },
    item3: {
        flex: 2,
        // backgroundColor: "#49beb7",
        width: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
        left: '10%',
        alignItems: 'center'
    },
    buttonTitle: {
        flex: 1,
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'center',
        color: 'white',
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
    },
    input: {
        borderWidth: 2,
        borderColor: '#31C261',
        borderRadius: 5,
        paddingTop: 6,
        paddingBottom: 6,
        paddingRight: 10,
        paddingLeft: 10,
        margin: 5,
        width: '100%'
    },
    radioButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    birthdayYearInput: {
        flex: 3,
        borderWidth: 2,
        borderColor: '#31C261',
        borderRadius: 5,
        paddingTop: 6,
        paddingBottom: 6,
        paddingRight: 10,
        paddingLeft: 10,
        marginEnd: 5
    },
    birthdayMonthInput: {
        flex: 2,
        borderWidth: 2,
        borderColor: '#31C261',
        borderRadius: 5,
        paddingTop: 6,
        paddingBottom: 6,
        paddingRight: 10,
        paddingLeft: 10,
        marginEnd: 5
    },
    birthdayDateInput: {
        flex: 2,
        borderWidth: 2,
        borderColor: '#31C261',
        borderRadius: 5,
        paddingTop: 6,
        paddingBottom: 6,
        paddingRight: 10,
        paddingLeft: 10,
    }
});
