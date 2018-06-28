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

class Wallet extends BaseScreen {
		constructor(props) {
			super(props);
			this.ref = firebase.firestore().collection('users');
			this.state = {
				offset: 0,
				data_list: [],
				loading_indicator_state: true,
				isShowMore: false,
				jwt: ''
			};
		}
		//
		componentDidMount() {
			// this._get_accounts();
			this._create_wallet();
		}
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
		//==========
		render() {
			{/* define how to render country list */}

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

              <TouchableOpacity
                onPress={()=>this._test()}><Text>Test</Text></TouchableOpacity>

						</Container>
				);
		}
}

export default Wallet;
