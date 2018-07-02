import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity, FlatList, Alert} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon} from "native-base";
import {NavigationActions} from "react-navigation";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import {API_URI} from '../../utils/api_uri';
import store from 'react-native-simple-store';
import RNExitApp from 'react-native-exit-app';
import {setting, Coinbase} from "../../utils/config";
import firebase from 'react-native-firebase';

import Utils from "../../utils/functions";
import {C_Const, C_MULTI_LANG} from '../../utils/constant';
import RequestData from '../../utils/https/RequestData';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const avatar = require('../../../img/default_avatar.jpg');

class Wallet extends BaseScreen {
		constructor(props) {
			super(props);
			this.ref = firebase.firestore();
			this.state = {
				offset: 0,
				data_list: [],		//wallet list
				loading_indicator_state: true,
				isShowMore: false,
				is_logined: false,		//indicate user logined or not
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
					this._check_logined_user();
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
		//check whether user logined before
		_check_logined_user = () => {
			store.get(C_Const.STORE_KEY.USER_INFO)
			.then(user_info => {
				Utils.dlog(user_info);
					if (user_info!=null && !Utils.isEmpty(user_info[C_Const.STORE_KEY.USER_ID]) && !Utils.isEmpty(user_info[C_Const.STORE_KEY.EMAIL])){
						//logined
						this.setState({is_logined: true});
						//get list of wallets (address)
						this._get_addresses_by_user(user_info[C_Const.STORE_KEY.USER_ID]);
					} else {
						//not login yet
						this.setState({is_logined: false});
					}
			});
		};
		//get wallets (addresses) of user
		_get_addresses_by_user = (user_id) => {
			var col_address = this.ref.collection(C_Const.COLLECTION_NAME.ADDRESS);
			//find if this user has some addresses
			col_address.where('user_id', '==', user_id)
	    .get().then(function(querySnapshot) {
					if (querySnapshot.size == 0){
						//there is no wallets
						Utils.dlog('There is no wallet');
					} else {
						//there is wallet
						Utils.xlog('wallets', querySnapshot);
					}
				});
		};
		//DB Firestore
		_test2 = () => {
			this.ref.get().then((documentSnapshot) => {
				documentSnapshot.forEach(function(doc) {
				 console.log(doc.id, " => ", doc.data());
		 		});
		  });

		};
		//test some API
		_get_accounts = () => {
      var extra_headers = Utils.createCoinbaseHeader('GET', API_URI.WALLET_ACCOUNTS);
			RequestData.sentGetRequestWithExtraHeaders(setting.WALLET_IP + API_URI.WALLET_ACCOUNTS, extra_headers,
				(detail, error) => {
					if (detail){
						Utils.xlog('detail get acc', detail);
						//get addresses
						if (detail.data){
							this._get_addresses();
						}
					} else if (error){
						Utils.xlog('error', error);
					}
			});
		};
		//get addresses
		_get_addresses = () => {
			var extra_headers = Utils.createCoinbaseHeader('GET', '/v2/accounts/d0ca887e-21dc-5425-b37e-c5505c22cbee/addresses');
			RequestData.sentGetRequestWithExtraHeaders(setting.WALLET_IP + '/v2/accounts/d0ca887e-21dc-5425-b37e-c5505c22cbee/addresses', extra_headers,
				(detail, error) => {
					if (detail){
						Utils.xlog('detail get addr', detail);
					} else if (error){
						Utils.xlog('error', error);
					}
			});
		};
		//create new account
		_begin_register = () => {
			this.props.navigation.navigate('Signup');
		};
		//login
		_begin_login = () => {
			this.props.navigation.navigate('Login');
		};
		//
		_open_create_wallet = () => {

		};
		//==========
		render() {
				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={common_styles.bold}>My wallets</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								<View style={common_styles.margin_b_20} />
								<View style={common_styles.view_align_center}>
									<Image source={avatar} style={styles.home_avatar}/>
								</View>
								{!this.state.is_logined && this.state.activating_coin_num > 0 &&
									<View style={common_styles.view_align_center}>
										<Button transparent style={common_styles.default_button}
											onPress={this._begin_login.bind(this)}
										>
											<Text style={[common_styles.whiteColor, common_styles.float_center]}>Login</Text>
										</Button>
										<Button transparent style={common_styles.default_button}
											onPress={this._begin_register.bind(this)}
										>
											<Text style={[common_styles.whiteColor, common_styles.float_center]}>Signup</Text>
										</Button>
									</View>
								}

							</Content>
						</Container>
				);
		}
}

export default Wallet;
