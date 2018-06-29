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
import firebase from 'react-native-firebase';
import store from 'react-native-simple-store';

import {API_URI} from '../../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';
import {setting} from "../../utils/config";
//https://github.com/moschan/react-native-simple-radio-button
class CreateWallet extends BaseScreen {
		constructor(props) {
			super(props);
			this.ref = firebase.firestore().collection(C_Const.COLLECTION_NAME.ADDRESS);
			this.state = {
        name: '',   //name of wallet
        code: '',   //coin code, ex: BTC, ETH, ...
        user_id: '',
				isSubmitting: false,
				err_mess: '',
				loading_indicator_state: false
			};
		}
		//
		componentDidMount() {
      //get user id from store
      store.get(C_Const.STORE_KEY.USER_INFO)
      .then(res => {
        if (res!=null && !Utils.isEmpty(res[C_Const.STORE_KEY.USER_ID]) && !Utils.isEmpty(res[C_Const.STORE_KEY.EMAIL])){
          this.setState({user_id: res[C_Const.STORE_KEY.USER_ID]});
        } else {
          //error
        }
      });
		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		};
		//check if all input values are valid
		_is_valid_input(){
			var all_valid = false;
			if (Utils.trim(this.state.name) == ''){
				this.setState({err_mess: C_Const.TEXT.ERR_EMPTY_NAME});
			} else if (Utils.trim(this.state.user_id) == ''){
				this.setState({err_mess: C_Const.TEXT.ERR_SERVER});
			} else {
        all_valid = true;
      }
			return all_valid;
		};
		//user clicks Create
		_create_wallet = () => {
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
      //create wallet (address) in Coinbase
      var extra_headers = Utils.createCoinbaseHeader('POST', '/v2/accounts/91735a18-d8ef-5c40-bb4f-8ce64acf8bba/addresses?name=app3');
			RequestData.sentPostRequestWithExtraHeaders(setting.WALLET_IP + '/v2/accounts/91735a18-d8ef-5c40-bb4f-8ce64acf8bba/addresses?name=app3',
				extra_headers, null, (detail, error) => {
				if (detail){
					Utils.xlog('detail create addr', detail);
				} else if (error){
					Utils.xlog('error', error);
				}
			});





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
								 device_version: Platform.OS + ' ' + DeviceInfo.getSystemVersion(),
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
										<Text style={[common_styles.blueColor, common_styles.float_left, styles.txt_label]}>Wallet name</Text>
									</View>
									<View style={common_styles.txt_item_center_row}>
											<Body style={common_styles.flex_100p}><TextInput ref='name' returnKeyType = {"next"} style={[common_styles.text_input]}
											 placeholder={'Wallet name'} autoCapitalize="none" onChange={(event) => this.setState({name: event.nativeEvent.text})}/></Body>
									</View>

                </Form>

								<View style={common_styles.view_align_center}>
									<Button transparent style={common_styles.default_button}
											onPress={this._create_wallet.bind(this)}
									>
										<Text style={[common_styles.whiteColor, common_styles.float_center]}>Create</Text>
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

export default CreateWallet;
