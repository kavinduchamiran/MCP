import React from 'react';
import {ScrollView, Picker, StyleSheet, SafeAreaView, View, Dimensions, Text, TextInput} from 'react-native';
import {
    TextField,
    FilledTextField,
    OutlinedTextField,
} from 'react-native-material-textfield';
//import TextBox from "../components/TextBox";
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Button, SocialIcon} from 'react-native-elements';
import Hr from "react-native-hr-component";
import store from '../store/store'
import {styles} from '../styles/styles'

import CircledNumber from "../components/CircledNumber";

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
        super(props)
        const {dispatch} = props
        // Here's a good use case for bindActionCreators:
        // You want a child component to be completely unaware of Redux.
        // We create bound versions of these functions now so we can
        // pass them down to our child later.
        this.boundActionCreators = bindActionCreators(addUserAction, dispatch)
        console.log(this.boundActionCreators)
        // {
        //   addTodo: Function,
        //   removeTodo: Function
        // }
    }

    User = {}
    addFeature = (feature) => {
        this.User = {...this.User, ...feature}
    }

    handleSubmit() {
        // Injected by react-redux:
        let {dispatch} = this.props
        // Note: this won't work:
        // TodoActionCreators.addTodo('Use Redux')
        // You're just calling a function that creates an action.
        // You must dispatch the action, too!
        // This will work:
        let action = addUserAction(this.User)
        dispatch(action)
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.item1}>
                        <Text style={styles.text}>Accommodation Sign up</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <CircledNumber start={true} active={true}>1</CircledNumber>
                            <CircledNumber>2</CircledNumber>
                            <CircledNumber end={true}>3</CircledNumber>
                        </View>
                    </View>
                    <View style={styles.item2}>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={"HOTEL"}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.addFeature({acc_type: itemValue})
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
                            secureTextEntry
                            onChangeText={text => {
                                this.addFeature({capacity: text})
                            }}
                        />
                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Address'}
                            secureTextEntry
                            onChangeText={text => {
                                this.addFeature({address: text})
                            }}
                        />
                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Telephone'}
                            secureTextEntry
                            onChangeText={text => {
                                this.addFeature({telephone: text})
                            }}
                        />
                        <TextInput
                            style={styles.TextBoxStyle}
                            placeholder={'  Available'}
                            secureTextEntry
                            onChangeText={text => {
                                this.addFeature({available: text})
                            }}
                        />
                    </View>
                    <View style={styles.item3}>
                        <Button
                            buttonStyle={{
                                backgroundColor: '#31C261',
                                width: '100%'
                            }}
                            titleStyle={styles.ButtonTitle}
                            title="    Continue"
                            icon={() => <FontAwesome name="long-arrow-right" size={25} style={{color: 'white'}}/>}
                            onPress={() => {
                                //Alert.alert('Simple Button pressed')
                                console.log(" Added User Details")
                                this.handleSubmit()
                            }}
                        />

                        <Hr
                            lineColor="#eee"
                            thickness={3}
                            textPadding={30}
                            hrPadding={70}
                            text="or"
                            hrStyles={{marginVertical: 40}}
                            textStyles={{color: '#97A19A', fontSize: 25}}
                        />

                        <Button
                            buttonStyle={{
                                backgroundColor: '#6600EA',
                                width: '100%',
                                marginVertical: 10
                            }}
                            titleStyle={styles.ButtonTitle}
                            title="   Continue with Google"
                            icon={() => <FontAwesome name="google" size={25} style={{color: 'white'}}/>}
                            onPress={() =>
                                Alert.alert('Simple Button pressed')
                            }
                        />

                        <Button
                            buttonStyle={{
                                backgroundColor: '#2277D8',
                                width: '100%'
                            }}
                            titleStyle={styles.ButtonTitle}
                            title="   Continue with Facebook"
                            icon={() => <FontAwesome name="facebook" size={25} style={{color: 'white'}}/>}
                            onPress={() => {
                                Alert.alert('Simple Button pressed')
                            }}
                        />
                    </View>
                    <View style={styles.item4}>
                        <Text style={styles.text}>Already have an account? </Text>
                        <Text style={{...styles.text, color: '#31C161', fontWeight: "bold"}}>Sign in</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const AccommodationScreen = connect()(accommodation);

export default AccommodationScreen;
