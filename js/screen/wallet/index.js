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

import Utils from "../../utils/functions";
import {C_Const, C_MULTI_LANG} from '../../utils/constant';
import RequestData from '../../utils/https/RequestData';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CryptoJS from 'crypto-js';

class Wallet extends BaseScreen {
		constructor(props) {
			super(props);
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
			//get language
		}
		//test some API
		_test = () => {
      //https://github.com/brix/crypto-js
      var rawHmac = CryptoJS.HmacSHA256('abc', Coinbase.SECRET_KEY).toString();
      var e64 = CryptoJS.enc.Base64.parse(rawHmac);
      var eHex = e64.toString(CryptoJS.enc.Hex);

      Utils.dlog(eHex);

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
