import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity, FlatList, ScrollView, Share, Alert} from "react-native";

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
			this.ref = firebase.firestore().collection('users');
			this.state = {
				offset: 0,
				data_list: [],
				loading_indicator_state: true,
				isShowMore: false,
				is_logined: false		//indicate user logined or not
			};
		}
		//
		componentDidMount() {
			this._check_logined_user();
			// this._get_accounts();
			// this._create_wallet();
		}
		//check whether user logined before
		_check_logined_user = () => {
			store.get(C_Const.STORE_KEY.USER_INFO)
			.then(user_info => {
					if (user_info!=null && !Utils.isEmpty(user_info[C_Const.STORE_KEY.USER_ID])){
						//logined
						this.setState({is_logined: true});
					} else {
						//not login yet
						this.setState({is_logined: false});
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
		//Create new wallet
		_create_wallet = () => {
      var extra_headers = Utils.createCoinbaseHeader('POST', '/v2/accounts/91735a18-d8ef-5c40-bb4f-8ce64acf8bba/addresses?name=app3');
			RequestData.sentPostRequestWithExtraHeaders(setting.WALLET_IP + '/v2/accounts/91735a18-d8ef-5c40-bb4f-8ce64acf8bba/addresses?name=app3',
				extra_headers, null, (detail, error) => {
				if (detail){
					Utils.xlog('detail create addr', detail);
				} else if (error){
					Utils.xlog('error', error);
				}
			});
		};
		//create new account
		_begin_register = () => {
			
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
									<Button
										transparent
										onPress={() => this._open_qr_scanner()}
									>
										<FontAwesome name="qrcode" style={styles.header_icon}/>
									</Button>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								<View style={common_styles.margin_b_20} />
								<View style={common_styles.view_align_center}>
									<Image source={avatar} style={styles.home_avatar}/>
								</View>
								{!this.state.is_logined &&
								<View style={common_styles.view_align_center}>
									<Button transparent style={common_styles.default_button}
										onPress={this._begin_register()}
									>
										<Text style={[common_styles.whiteColor, common_styles.float_center]}>Create new wallet</Text>
									</Button>
								</View>
								}
							</Content>
						</Container>
				);
		}
}

export default Wallet;
