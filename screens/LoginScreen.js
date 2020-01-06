import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback, AsyncStorage} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";
import {Button} from "react-native-elements";
import Hr from "react-native-hr-component";

export default class LoginScreen extends React.Component {
    // static navigationOptions = {
    //     title: 'Sign In',
    // };

    state = {
        // todo clear these values
        email: '',
        password: '',
        error: null
    };

    handleLogin = async () => {
        try{
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            });

            const {status, errors, user} = await response.json();

            if (!status) {
                this.setState({error: errors})
            }else{
                await AsyncStorage.setItem('user', JSON.stringify(user));

                global.AuthUser = user;

                this.props.navigation.navigate(user.type);
            }
        }catch (e) {
            console.log(e);
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {navigate} = this.props.navigation;
        const registerHandler = () => navigate('Register');

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/*Text Fields*/}
                    <View style={styles.content}>
                        <Text style={{
                            alignContent: 'center',
                            height: 80,
                            marginVertical: 15,
                            textAlign: 'center',
                            // backgroundColor: '#f43',
                            fontSize: 30
                        }}>Sign In</Text>

                        <TextInput
                            textContentType={"emailAddress"}
                            keyboardType={"email-address"}
                            style={styles.input}
                            placeholder={'Email'}
                            value={this.state.email}
                            onChangeText={email => this.setState({error: null, email})}
                        />
                        <TextInput
                            textContentType={"password"}
                            style={styles.input}
                            placeholder={'Password'}
                            secureTextEntry
                            value={this.state.password}
                            onChangeText={password => this.setState({error: null, password})}
                        />

                        <Button
                            buttonStyle={{
                                backgroundColor: '#31C261',
                                width: '100%',
                                marginTop: 10,
                                marginBottom: 10
                            }}
                            titleStyle={styles.buttonTitle}
                            title="Sign In"
                            onPress={this.handleLogin}
                        />
                    </View>

                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
                        {this.state.error &&
                        <Text
                            style={{fontSize: 20, color: 'red'}}
                        >
                            {this.state.error}
                        </Text>}
                    </View>

                    <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                        <TouchableOpacity onPress={registerHandler}>
                            <Text style={styles.text}>Haven't registered yet?
                                <Text style={{...styles.text, color: '#31C161', fontWeight: "bold"}}> Sign Up</Text>
                            </Text>
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
    content: {
        flex: 3,
        marginTop: 30,
        width: '80%',
        flexDirection: 'column',
        // justifyContent: 'center',
        alignItems: 'center',
        left: '10%'
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
    }, text: {
        fontFamily: 'sofiapro-light',
        fontWeight: "bold",
        fontSize: 20
    },
    buttonTitle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'sofiapro-light',
        fontWeight: '400',
        fontSize: 16
    }
});
