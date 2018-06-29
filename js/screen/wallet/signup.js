import React, {Component} from "react";
import {View, TouchableOpacity, Share, Dimensions, Platform, TextInput} from "react-native";

import {Container, Content, Button, Text, Header, Body, Left, Right, Icon, Form} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const, C_MULTI_LANG} from '../../utils/constant';
import AutoHTML from 'react-native-autoheight-webview';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import store from 'react-native-simple-store';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

import RequestData from '../../utils/https/RequestData';
import {API_URI} from '../../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';
import {setting} from "../../utils/config";

class Signup extends BaseScreen {
		constructor(props) {
			super(props);
			this.ref = firebase.firestore().collection(C_Const.COLLECTION_NAME.USER);
			this.state = {
				title: '',
				content: '',
				link: '',
        fields: {		//values in form
  				email: '',
  				password: '',
					confirm_password: '',
					mnemonic: ''
  			},
				isSubmitting: false,
				err_mess: '',
				loading_indicator_state: false
			};
		}
		//
		componentDidMount() {
			// this._test();

		}
		//
		_test = () => {

		};
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		};
		//check if all input values are valid
		_is_valid_input(values){
			var all_valid = false;
			if (Utils.trim(values.email) == ''){
				this.setState({err_mess: C_Const.TEXT.ERR_EMPTY_EMAIL});
			} else if (!Utils.validateEmail(values.email)){
				this.setState({err_mess: C_Const.TEXT.ERR_WRONG_EMAIL});
			} else if (Utils.trim(values.password) == ''){
				this.setState({err_mess: C_Const.TEXT.ERR_INVALID_PASSWORD});
			} else if (Utils.trim(values.password).length < 8){
				this.setState({err_mess: C_Const.TEXT.ERR_SHORT_PASS_LEN});
			} else if (Utils.trim(values.confirm_password) == ''){
				this.setState({err_mess: C_Const.TEXT.ERR_EMPTY_CONFIRM_PASS});
			} else if (Utils.trim(values.password) != Utils.trim(values.confirm_password)){
				this.setState({err_mess: C_Const.TEXT.ERR_WRONG_CONFIRM_PASS});
			} else {
				all_valid = true;
			}
			return all_valid;
		};
		//user clicks Register
		_signup = () => {
			if (this.state.isSubmitting){
				return;
			}
			if (!this._is_valid_input(this.state.fields)){
				return;
			}
			//clear messages
			this.setState({
				err_mess: '',
				isSubmitting: true,
				loading_indicator_state: true
			});
			var me = this;
			//check if email existed
			this.ref.where('email', '==', this.state.fields.email)
	    .get().then(function(querySnapshot) {
					if (querySnapshot.size == 0){
						//email not existed, create a record in DB
						me.ref.add({
								email: Utils.trim(me.state.fields.email),
								password: Utils.encrypt_text(me.state.fields.password),
								mnemonic: Utils.trim(me.state.fields.email),
								create_time: Utils.formatDatetime(Date.now()),
								app_id: DeviceInfo.getBundleId(),
								 app_name: DeviceInfo.getApplicationName(),
								 app_version: DeviceInfo.getVersion(),
								 device_id: DeviceInfo.getUniqueID(),
								 device_name: DeviceInfo.getDeviceId(),
								 device_version: Platform.OS + ' ' + DeviceInfo.getSystemVersion()
						})
						.then(function(docRef) {
								//save info to Preference/Store
								store.update(C_Const.STORE_KEY.USER_INFO, {
										user_id: docRef.id,
										email: me.state.fields.email
								});
								//verify it's saved into Store
								setTimeout( () => {		//to make sure it's saved
									store.get(C_Const.STORE_KEY.USER_INFO)
									.then(res => {
										if (res!=null && !Utils.isEmpty(res[C_Const.STORE_KEY.USER_ID]) && !Utils.isEmpty(res[C_Const.STORE_KEY.EMAIL])){
											//saved
											//todo: trigger previous page
											// this.props.navigation.goBack();
										} else {
											//not saved, don't know why

										}
									});
									me.setState({err_mess: C_Const.TEXT.MESS_SIGNUP_OK, isSubmitting: false, loading_indicator_state: false});
								}, 100);
						})
						.catch(function(error) {
								me.setState({err_mess: C_Const.TEXT.ERR_SERVER, isSubmitting: false, loading_indicator_state: false});
						});
					} else {
						//email existed, show error
						me.setState({err_mess: C_Const.TEXT.ERR_EXISTED_EMAIL, isSubmitting: false, loading_indicator_state: false});
					}
	    })
	    .catch(function(error) {
					me.setState({err_mess: C_Const.TEXT.ERR_SERVER, isSubmitting: false, loading_indicator_state: false});
	    });
		};
		//
		_open_terms = () => {

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
										<Text uppercase={false} style={[common_styles.default_font_color]}>Create new wallet</Text>
									</View>
								</Body>
								<Right style={[common_styles.headerRight]}>

								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />

                <Form ref="register_form">
									<View style={common_styles.margin_t_5_ios_border} />
									<View style={common_styles.txt_item_center}>
										<Text style={[common_styles.blueColor, common_styles.float_left, styles.txt_label]}>Email (*)</Text>
									</View>
									<View style={common_styles.txt_item_center_row}>
											<Body style={common_styles.flex_100p}><TextInput ref='email' returnKeyType = {"next"} style={[common_styles.text_input]}
											onSubmitEditing={() => this.focusTextInput('password')}
											 placeholder={'Email'} autoCapitalize="none" onChange={(event) => this.setState({fields: {...this.state.fields, email : event.nativeEvent.text}})}/></Body>
									</View>
                  <View style={common_styles.margin_t_5_ios_border} />
                  <View style={common_styles.txt_item_center}>
                    <Text style={[common_styles.blueColor, common_styles.float_left, styles.txt_label]}>Password (*)</Text>
                  </View>
                  <View style={common_styles.margin_b_5_ios} />
                  <View style={common_styles.txt_item_center_row}>
                      <Body style={common_styles.flex_100p}><TextInput ref='password' returnKeyType = {"next"} style={common_styles.text_input}
                      onSubmitEditing={() => this.focusTextInput('confirm_password')}
                       placeholder={'Password'} autoCapitalize="none" secureTextEntry={true} onChange={(event) => this.setState({fields: {...this.state.fields, password : event.nativeEvent.text}})}/></Body>
                  </View>
									<View style={common_styles.margin_t_5_ios_border} />
                  <View style={common_styles.txt_item_center}>
                    <Text style={[common_styles.blueColor, common_styles.float_left, styles.txt_label]}>Confirm Password (*)</Text>
                  </View>
                  <View style={common_styles.margin_b_5_ios} />
                  <View style={common_styles.txt_item_center_row}>
                      <Body style={common_styles.flex_100p}><TextInput ref='confirm_password' returnKeyType = {"next"} style={common_styles.text_input}
                      onSubmitEditing={() => this.focusTextInput('mnemonic')}
                       placeholder={'Confirm Password'} autoCapitalize="none" secureTextEntry={true} onChange={(event) => this.setState({fields: {...this.state.fields, confirm_password : event.nativeEvent.text}})}/></Body>
                  </View>
                  <View style={common_styles.margin_t_5_ios_border} />
                  <View style={common_styles.txt_item_center}>
                    <Text style={[common_styles.blueColor, common_styles.float_left, styles.txt_label]}>Mnemonic</Text>
                  </View>
                  <View style={common_styles.txt_item_center_row}>
                      <Body style={common_styles.flex_100p}><TextInput ref='mnemonic' returnKeyType = {"done"} style={[common_styles.text_input]}
                       placeholder={'Mnemonic'} autoCapitalize="none" onChange={(event) => this.setState({fields: {...this.state.fields, mnemonic : event.nativeEvent.text}})}/></Body>
                  </View>
                </Form>

								<View style={common_styles.view_align_center}>
									<TouchableOpacity onPress={this._open_terms()}>
										<Text>I read & accepted <Text style={common_styles.a_href}>Terms & Conditions</Text></Text>
									</TouchableOpacity>
								</View>
								<View style={common_styles.view_align_center}>
									<Button transparent style={common_styles.default_button}
											onPress={this._signup.bind(this)}
									>
										<Text style={[common_styles.whiteColor, common_styles.float_center]}>Register</Text>
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

export default Signup;
