import React, {Component} from "react";
import {View, TouchableOpacity, Platform, Alert} from "react-native";

import {Container, Content, Button, Text, Header, Body, Left, Right, Icon, Form,Item,Input} from "native-base";

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

class Signup extends BaseScreen {
		constructor(props) {
			super(props);
			this.ref = firebase.firestore();
			this.state = {
        fields: {		//values in form
  				email: '',
  				password: '',
					confirm_password: '',
					mnemonic: ''
  			},
				isSubmitting: false,
				err_mess: '',
				user_id: '',
				loading_indicator_state: false,
				coin_list: {},		//activating coins
				is_created_all_addresses: false		//created all addresses
			};
		}
		//
		componentDidMount() {
			this._get_saved_coins();
		}
		//get list of activating coins from store
		_get_saved_coins = () => {
			store.get(C_Const.STORE_KEY.COIN_LIST)
			.then(res => {
				if (res!=null){
					this.setState({coin_list: res});
				} else {
					//don't have any coin, don't know why
					Alert.alert(
						'Alert',
						C_Const.TEXT.ERR_SERVER,
						[
							{text: 'OK', onPress: () => RNExitApp.exitApp()},
						],
						{ cancelable: false }
					);
				}
			});
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
			var collection_user = this.ref.collection(C_Const.COLLECTION_NAME.USER);
			collection_user.where('email', '==', Utils.trim(this.state.fields.email))
	    .get().then(function(querySnapshot) {
					if (querySnapshot.size == 0){
						//email not existed, create a record in DB
						collection_user.add({
								email: Utils.trim(me.state.fields.email),
								password: Utils.encrypt_text(me.state.fields.password),
								mnemonic: Utils.trim(me.state.fields.mnemonic),
								create_time: Utils.formatDatetime(Date.now()),
								app_id: DeviceInfo.getBundleId(),
								 app_name: DeviceInfo.getApplicationName(),
								 app_version: DeviceInfo.getVersion(),
								 device_id: DeviceInfo.getUniqueID(),
								 device_name: DeviceInfo.getDeviceId(),
								 device_version: Platform.OS + ' ' + DeviceInfo.getSystemVersion()
						})
						.then(function(docRef) {
								//save user info to Preference/Store
								store.update(C_Const.STORE_KEY.USER_INFO, {
										user_id: docRef.id,
										email: me.state.fields.email
								});
								//verify it's saved into Store
								setTimeout( () => {		//to make sure it's saved
									store.get(C_Const.STORE_KEY.USER_INFO)
									.then(res => {
										if (res!=null && !Utils.isEmpty(res[C_Const.STORE_KEY.USER_ID]) && !Utils.isEmpty(res[C_Const.STORE_KEY.EMAIL])){
											me.setState({
												user_id: docRef.id
											}, () => {
												me._create_addresses();
											});
										} else {
											//not saved, don't know why
											me._trigger_go_back();
										}
									});
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
		//create addresses
		_create_addresses = () => {
			var me = this;
			var coin_list_num = Utils.getObjLen(this.state.coin_list);
			var created_addr_num = 0;
			var collection_address = this.ref.collection(C_Const.COLLECTION_NAME.ADDRESS);
			Object.keys(this.state.coin_list).forEach(function(db_account_id) {
				//create wallet (address) in Coinbase
				var uri = '/v2/accounts/'+me.state.coin_list[db_account_id]['coinbase_id']+'/addresses';
	      var extra_headers = Utils.createCoinbaseHeader('POST', uri);
				RequestData.sentPostRequestWithExtraHeaders(setting.WALLET_IP + uri,
					extra_headers, null, (detail, error) => {
					if (detail && !Utils.isEmpty(detail.data)){
						// Utils.xlog('detail create addr', detail);
						//save into our DB
						collection_address.add({
								user_id: me.state.user_id,
								network: detail.data.network,
								coinbase_addr_id: detail.data.id,
								address: detail.data.address
						})
						.then(function(docRef) {
							created_addr_num++;		//created 1 address in Coinbase & DB
							if (created_addr_num == coin_list_num){
								me._trigger_go_back();		//back to Wallet page
							}
						})
						.catch(function(error) {
							//cannot save in DB
							me._trigger_go_back();
						});
					} else if (error){
						//create address failed in Coinbase
						me._trigger_go_back();
					}
				});
			});
		};
		//go back after signup
		_trigger_go_back = () => {
			this.props.navigation.state.params.onFinishSignUp();
			this.props.navigation.goBack();
		};
		//open terms page
		_open_terms = () => {

		};
	 //==========
		render() {
				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
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
										<Text uppercase={false} style={[common_styles.bold, common_styles.default_font_color]}>Sign Up</Text>
									</View>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>

								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />

                <Form ref="register_form">
									<Item>
										<Input placeholder="Email" keyboardType={'email-address'} autoCapitalize="none" onChange={(event) => this.setState({fields: {...this.state.fields, email : event.nativeEvent.text}})}/>
									</Item>
									<Item>
										<Input placeholder="Password" secureTextEntry={true} autoCapitalize="none" onChange={(event) => this.setState({fields: {...this.state.fields, password : event.nativeEvent.text}})}/>
									</Item>
									<Item>
										<Input placeholder="Confirm Password" secureTextEntry={true} autoCapitalize="none" onChange={(event) => this.setState({fields: {...this.state.fields, confirm_password : event.nativeEvent.text}})}/>
									</Item>
									<Item>
										<Input placeholder="Mnemonic" autoCapitalize="none" onChange={(event) => this.setState({fields: {...this.state.fields, mnemonic : event.nativeEvent.text}})}/>
									</Item>

                </Form>

								<View style={[common_styles.view_align_center]}>
									<Button transparent style={common_styles.default_button}
											onPress={this._signup.bind(this)}
									>
										<Text style={[common_styles.whiteColor, common_styles.float_center]}>Sign Up</Text>
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
