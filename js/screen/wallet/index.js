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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const avatar = require('../../../img/default_avatar.jpg');
const bitcoin = require("../../../img/icons/BTC.png");
const ethereum = require("../../../img/icons/ETH.png");
const bitcoin_cash = require("../../../img/icons/BCH.png");
const litecoin = require("../../../img/icons/LTC.png");

class Wallet extends BaseScreen {
		constructor(props) {
			super(props);
			this.ref = firebase.firestore();
			this.state = {
				data_list: [],		//wallet list to show in DB
				loading_indicator_state: true,
				isShowMore: false,
				coin_list: {},		//activating coins
				is_logined: false,		//indicate user logined or not
				address_list: {}		//addresses saved in DB
			};
		}
		//
		componentDidMount() {
			this._get_saved_coins();
		}
		//
		_get_icon = (name) => {
			if (name == 'bitcoin'){
				return bitcoin;
			} else if (name == 'ethereum'){
				return ethereum;
			} else if (name == 'bitcoin_cash'){
				return bitcoin_cash;
			} else if (name == 'litecoin'){
				return litecoin;
			}
		};
		//get list of activating coins from store
		_get_saved_coins = () => {
			store.get(C_Const.STORE_KEY.COIN_LIST)
			.then(res => {
				if (res!=null){
					this.setState({coin_list: res}, () => {
						this._check_logined_user();
					});
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
		_keyExtractor = (item) => item.code;
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
				<View style={[styles.wallet_item, common_styles.fetch_row]}>
					<Image source={this._get_icon(item.network)} style={styles.coin_icon}/>
					<Text style={styles.coin_name}>{item.code}</Text>
					<Text style={styles.td_item}>{item.total}</Text>
					<TouchableOpacity onPress={()=>this._send_amount(item.code, item.coinbase_id)} style={[styles.icon_send]}>
						<FontAwesome name="send" style={[styles.icon, common_styles.default_font_color]}/>
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>this._open_qr(item.code, item.address)} style={[styles.icon_qr]}>
						<FontAwesome name="qrcode" style={[styles.icon, common_styles.default_font_color]}/>
					</TouchableOpacity>
				</View>
		);
		//
		_send_amount = (code, account_id) => {
			this.props.navigation.navigate('SendCoin', {
				account_id: account_id,
				code: code
			});
		};
		//
		_open_qr = (code, address) => {
			this.props.navigation.navigate('QRCode', {
				address: address,
				code: code
			});
		};
		//check whether user logined before
		_check_logined_user = () => {
			var me = this;
			store.get(C_Const.STORE_KEY.USER_INFO)
			.then(user_info => {
				// Utils.xlog('user_info', user_info);
					if (user_info!=null && !Utils.isEmpty(user_info[C_Const.STORE_KEY.USER_ID]) && !Utils.isEmpty(user_info[C_Const.STORE_KEY.EMAIL])){
						//logined
						this.setState({is_logined: true});
						//convert into showing list
						Object.keys(this.state.coin_list).forEach(function(db_account_id) {
							me.state.data_list.push(me.state.coin_list[db_account_id]);
						});
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
			var me = this;
			var col_address = this.ref.collection(C_Const.COLLECTION_NAME.ADDRESS);
			//find if this user has some addresses
			col_address.where('user_id', '==', user_id)
	    .get().then(function(querySnapshot) {
					if (querySnapshot.size == 0){
						//there is no wallets
						Utils.dlog('There is no address');
					} else {
						//there is wallet
						querySnapshot.forEach(function(doc) {
							me.state.address_list[doc.data()['network']] = doc.data()['address'];
							//get information of each address
							me._get_address_transactions(doc.data());
				 		});
					}
				});
		};
		//get transactions of each address
		_get_address_transactions = (addr_db_info) => {
			//get account id corresponding to this address
			var coinbase_acc_id = '';
			var me = this;
			Object.keys(this.state.coin_list).forEach(function(db_account_id) {
				if (me.state.coin_list[db_account_id]['network'] == addr_db_info['network']){
					coinbase_acc_id = me.state.coin_list[db_account_id]['coinbase_id'];
				}
			});
			var uri = '/v2/accounts/'+coinbase_acc_id+'/addresses/'+addr_db_info['coinbase_addr_id']+'/transactions';
			var extra_headers = Utils.createCoinbaseHeader('GET', uri);
			RequestData.sentGetRequestWithExtraHeaders(setting.WALLET_IP + uri, extra_headers,
				(detail, error) => {
					if (detail){
						// Utils.xlog('detail get trans', detail);
						//todo: get all transactions
						me._calculate_total(detail.data);
					} else if (error){
						Utils.xlog('error', error);
					}
			});
		};
		//open create new account
		_begin_register = () => {
			this.props.navigation.navigate('Signup', {
				onFinishSignUp: this._on_finish_signup
			});
		};
		//listen even after user signup
		_on_finish_signup = () => {
			this._check_logined_user();
		};
		//login
		_begin_login = () => {
			this.props.navigation.navigate('Login', {
				onFinishLogin: this._on_finish_signup
			});
		};
		//calculate total amount of 1 address
		//https://developers.coinbase.com/api/v2#list-address39s-transactions
		_calculate_total = (trans_list) => {
			var me = this;
			var len = trans_list.length;
			var total = 0;
			var network_name = '';
			for (var i=0; i<len; i++){
				if (trans_list[i]['status'] == 'completed'){
					total += trans_list[i]['amount']['amount'];
				}
				network_name = trans_list[i]['network']['name'];
			}
			//update total to the list
			let newArray = [...this.state.data_list];
			for (var i=0; i<this.state.data_list.length; i++){
				newArray[i]['total'] = 0;
				if (network_name == this.state.data_list[i]['network']){
					newArray[i]['total'] = total;
				}
				//assign address to each wallet (account)
				Object.keys(this.state.coin_list).forEach(function(db_account_id) {
						newArray[i]['address'] = me.state.address_list[newArray[i]['network']];
				});
			}
			//
			this.setState({data_list: newArray});
		};
		//
		_log_out = () => {
			store.update(C_Const.STORE_KEY.USER_INFO, {
          user_id: '',
          email: ''
      });
			//reset data
			this.setState({
				data_list: [],		//wallet list to show in DB
				is_logined: false,		//indicate user logined or not
				address_list: {}
			});
      //verify it's saved into Store
      setTimeout( () => {		//to make sure it's saved
        store.get(C_Const.STORE_KEY.USER_INFO)
        .then(res => {
          if (res!=null && Utils.isEmpty(res[C_Const.STORE_KEY.USER_ID]) && Utils.isEmpty(res[C_Const.STORE_KEY.EMAIL])){
            //saved
						this._check_logined_user();
          } else {
            //not saved, don't know why
          }
        });
      }, 100);
		};
		//
		_forgot_pass = () => {
			this.props.navigation.navigate('ForgotPass');
		};
		//==========
		render() {
				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={[common_styles.bold, common_styles.default_font_color]}>My wallets</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								{this.state.is_logined &&
									<TouchableOpacity style={common_styles.margin_r_10} onPress={() => this._log_out()} style={{marginRight:10, justifyContent: 'flex-start', marginBottom:3}}>
										<MaterialCommunityIcons name="logout" style={[common_styles.default_font_color, {fontSize:21}]}/>
									</TouchableOpacity>
								}
								</Right>
							</Header>
							{/* END header */}
							<Content>
								<View style={common_styles.margin_b_20} />
								<View style={common_styles.view_align_center}>
									<Image source={avatar} style={styles.home_avatar}/>
								</View>
								{!this.state.is_logined &&
									<View>
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
										<View style={[common_styles.view_align_center, common_styles.margin_t_20, common_styles.margin_b_20]}>
											<TouchableOpacity onPress={this._forgot_pass.bind(this)}>
												<Text>Forgot your password, <Text style={styles.a_href}>tap here</Text></Text>
											</TouchableOpacity>
										</View>
									</View>
								}
								{this.state.is_logined &&
								<View style={{flex:1}}>
									<FlatList
												data={this.state.data_list}
												renderItem={this._renderItem}
												refreshing={false}
												onEndReachedThreshold={0.5}
												keyExtractor={this._keyExtractor}
												initialNumToRender={20}
											/>
								</View>
							}
							</Content>
						</Container>
				);
		}
}

export default Wallet;
