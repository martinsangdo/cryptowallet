import React, {Component} from "react";
import {View, TouchableOpacity} from "react-native";

import {Container, Content, Button, Text, Header, Body, Left, Right, Icon, Form,Item, Input} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import store from 'react-native-simple-store';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

import RequestData from '../../utils/https/RequestData';
import {API_URI} from '../../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';
import {setting} from "../../utils/config";

class Login extends BaseScreen {
		constructor(props) {
			super(props);
			this.ref = firebase.firestore().collection(C_Const.COLLECTION_NAME.USER);
			this.state = {
  			email: '',
  			password: '',
				isSubmitting: false,
				err_mess: '',
				loading_indicator_state: false
			};
		}
		//
		componentDidMount() {

		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		};
		//check if all input values are valid
		_is_valid_input(){
			var all_valid = false;
			if (Utils.trim(this.state.email) == ''){
				this.setState({err_mess: C_Const.TEXT.ERR_EMPTY_EMAIL});
			} else if (!Utils.validateEmail(this.state.email)){
				this.setState({err_mess: C_Const.TEXT.ERR_WRONG_EMAIL});
			} else if (Utils.trim(this.state.password) == ''){
				this.setState({err_mess: C_Const.TEXT.ERR_INVALID_PASSWORD});
			} else {
				all_valid = true;
			}
			return all_valid;
		};
		//user clicks Login
		_login = () => {
			if (this.state.isSubmitting){
				return;
			}
			if (!this._is_valid_input()){
				return;
			}
			//clear messages
			this.setState({
				err_mess: '',
				isSubmitting: true,
				loading_indicator_state: true
			});
			var me = this;
			//check if account is correct

			this.ref.where('email', '==', Utils.trim(this.state.email)).where('password', '==', Utils.encrypt_text(me.state.password))
	    .get().then(function(querySnapshot) {
					if (querySnapshot.size == 0){
            //account not found
            me.setState({err_mess: C_Const.TEXT.ERR_LOGIN_FAILED, isSubmitting: false, loading_indicator_state: false});
					} else {
						//found 1 account
            //save user info to Preference/Store
            querySnapshot.forEach(function(doc) {
              store.update(C_Const.STORE_KEY.USER_INFO, {
                  user_id: doc.id,
                  email: doc.data()['email']
              });
              //verify it's saved into Store
              setTimeout( () => {		//to make sure it's saved
                store.get(C_Const.STORE_KEY.USER_INFO)
                .then(res => {
                  me._trigger_go_back();
                });
              }, 100);
            });
					}
	    })
	    .catch(function(error) {
        Utils.dlog(error);
					me.setState({err_mess: C_Const.TEXT.ERR_SERVER, isSubmitting: false, loading_indicator_state: false});
	    });
		};
    //go back after signup
		_trigger_go_back = () => {
			this.props.navigation.state.params.onFinishLogin();
			this.props.navigation.goBack();
		};
	 //==========
		render() {
				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={styles.left}>
									<TouchableOpacity onPress={() => this._on_go_back()}>
										<View style={styles.left_row}>
											<View style={[common_styles.float_center]}>
												<Icon name="ios-arrow-back-outline" style={common_styles.default_font_color}/>
											</View>
										</View>
									</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<View style={[common_styles.margin_l_10, common_styles.float_center]}>
										<Text uppercase={false} style={[common_styles.default_font_color]}>Login</Text>
									</View>
								</Body>
								<Right style={[common_styles.headerRight]}>

								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />

                <Form ref="register_form">
                  <Item>
                    <Input placeholder="Email" keyboardType={'email'} autoCapitalize="none" onChange={(event) => this.setState({email: event.nativeEvent.text})}/>
                  </Item>
                  <Item>
                    <Input placeholder="Password" secureTextEntry={true} autoCapitalize="none" onChange={(event) => this.setState({password: event.nativeEvent.text})}/>
                  </Item>
                </Form>

								<View style={common_styles.view_align_center}>
									<Button transparent style={common_styles.default_button}
											onPress={this._login.bind(this)}
									>
										<Text style={[common_styles.whiteColor, common_styles.float_center]}>Login</Text>
									</Button>
								</View>
								<View style={common_styles.view_align_center}>
									<Text style={common_styles.redColor}>{this.state.err_mess}</Text>
								</View>
							</Content>
						</Container>
				);
		}
}

export default Login;
