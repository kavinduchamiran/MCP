import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Alert} from "react-native";
import {Button} from "react-native-elements";
import {ActivityType} from "expo-location";


class Step extends PureComponent {
    state = {};

    handleRegister = async (user) => {
        this.setState({loading: true});

        try{
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ...user,
                    gender: user.gender.toUpperCase(),
                    type: user.type.substr(0,3).toUpperCase()
                })
            });

            const {status, errors, id} = await response.json();

            if (!status) {
                let errorMsg = '';

                Object.keys(errors).map(key => {
                   errorMsg += `${errors[key].message} \n`
                });

                Alert.alert(
                    'Registration error',
                    errorMsg,
                    [{
                        text: 'OK'
                    }]
                );

                this.setState({loading: false});
            }else{
                this.props.nextStep();

                global.userId = id;

                // await AsyncStorage.setItem('user', JSON.stringify(user));
                //
                // global.AuthUser = user;

                // this.props.navigation.navigate();
            }
        }catch (error) {
            console.log(error)

            this.setState({loading: false});
        }
    };

    render() {
        return (
            <View style={{height: '100%', paddingTop: 40}}>
                {this.props.children}

                {this.props.screen === 1 &&
                <View style={styles.buttonContainer}>
                    <Button
                        disabled={!this.props.oneDisabled}
                        buttonStyle={{
                            backgroundColor: '#31C261',
                            width: '100%',
                            marginBottom: 5
                        }}
                        title="Next"
                        onPress={this.props.nextStep}

                    />
                </View>
                }

                {this.props.screen === 2 &&
                <View>
                    {this.state.loading ?
                        <View style={{alignItems: 'center', marginTop: 20}}>
                            <ActivityIndicator size={'large'} />
                        </View>
                        :
                        <View style={styles.buttonContainer}>
                            <Button
                                disabled={!this.props.twoDisabled}
                                buttonStyle={{
                                    backgroundColor: '#31C261',
                                    width: '100%',
                                    marginBottom: 5
                                }}
                                title="Next"
                                onPress={() => this.handleRegister(this.props.user)}
                            />

                            <Button
                                buttonStyle={{
                                    backgroundColor: '#6372c2',
                                    width: '100%',
                                    marginTop: 5
                                }}
                                title="Back"
                                disabled={this.props.currentIndex === 0}
                                onPress={this.props.prevStep}
                            />
                        </View>
                    }

                </View>
                }

                {/*{this.props.screen === 3 &&*/}
                {/*<View style={styles.buttonContainer}>*/}
                {/*    <Button*/}
                {/*        buttonStyle={{*/}
                {/*            backgroundColor: '#31C261',*/}
                {/*            width: '100%',*/}
                {/*            marginBottom: 5*/}
                {/*        }}*/}
                {/*        title="Go back"*/}
                {/*        onPress={this.props.prevStep}*/}
                {/*    />*/}
                {/*</View>*/}
                {/*}*/}
            </View>
        );

    }
}

class RegistrationSteps extends PureComponent {
    static Step = (prop) => <Step {...prop}/>
    state = {
        index: 0,
    };

    _nextStep = () => {
        if (this.state.index !== this.props.children.length - 1) {
            this.setState(prevState => ({
                index: prevState.index + 1,
            }));
        }
    };

    _prevStep = () => {
        if (this.state.index !== 0) {
            this.setState(prevState => ({
                index: prevState.index - 1,
            }));
        }
    };

    render() {
        return (
            <View style={{width: '100%'}}>
                {React.Children.map(this.props.children, (el, index) => {
                    if (index === this.state.index) {
                        return React.cloneElement(el, {
                            currentIndex: this.state.index,
                            nextStep: this._nextStep,
                            prevStep: this._prevStep,
                            isLast: this.state.index === this.props.children.length - 1,
                            isFirst: this.state.index === 0,
                        });
                    }
                    return null;
                })}
            </View>
        );
    }
}

export default RegistrationSteps;

const styles = {
    buttonContainer: {
        marginTop: 30,
    }
};
