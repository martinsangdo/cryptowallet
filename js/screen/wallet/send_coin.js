import React, {Component} from "react";
import {View, TouchableOpacity, Platform, Alert} from "react-native";

import {Container, Content, Button, Text, Header, Body, Left, Right, Icon, Form,Item,Input} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import store from 'react-native-simple-store';

import RequestData from '../../utils/https/RequestData';
import {API_URI} from '../../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';
import {setting} from "../../utils/config";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class SendCoin extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
  				to_address: '',
  				amount: 0,
					currency: '',
					description: 'hi',
				isSubmitting: false,
				err_mess: '',
				user_id: '',
				loading_indicator_state: false,
				account_id: ''
			};
		}
		//
		componentDidMount() {
			this.setState({
				account_id: this.props.navigation.state.params.account_id,
				currency: this.props.navigation.state.params.code
			});
		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		};
		//check if all input values are valid
		_is_valid_input(){
			var all_valid = false;
			if (Utils.trim(this.state.to_address) == ''){
				this.setState({err_mess: C_Const.TEXT.ERR_EMPTY_TO_ADDR});
			} else if (Utils.trim(this.state.amount) == '' || Utils.trim(this.state.amount) <= 0){
				this.setState({err_mess: C_Const.TEXT.ERR_INVALID_AMOUNT});
			} else {
				all_valid = true;
			}
			return all_valid;
		};
		//user clicks Register
		_begin_send = () => {
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
			//begin send money
			var uri = '/v2/accounts/'+me.state.account_id+'/transactions?to='+
					Utils.trim(this.state.to_address)+'&type=send&amount='+Utils.trim(this.state.amount)+
					'&currency='+this.state.currency+'&idem='+Utils.getTimestamp();
			if (!Utils.isEmpty(Utils.trim(this.state.description))){
				uri += '&description='+Utils.trim(this.state.description);
			}
			var extra_headers = Utils.createCoinbaseHeader('POST', uri);
			RequestData.sentPostRequestWithExtraHeaders(setting.WALLET_IP + uri,
				extra_headers, null, (detail, error) => {
				if (detail && !Utils.isEmpty(detail.data)){
					//send successfully
					this.setState({
						err_mess: C_Const.TEXT.MESS_SEND_COIN_OK
					});
				} else if (detail.errors){
					//send failed in Coinbase
					this.setState({
						err_mess: detail.errors[0].message
					});
				}
				this.setState({
					isSubmitting: false,
					loading_indicator_state: false
				});
			});
		};
		//after scanning qr code
		_scanned_qr = (code) => {
			this.setState({
				to_address: code
			});
		};
		//
		_open_scanner = () => {
			this.props.navigation.navigate('Scanner', {
				onScanned: this._scanned_qr
			});
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
												<Icon name="ios-arrow-back" style={common_styles.default_font_color}/>
											</View>
										</View>
									</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
										<Text uppercase={false} style={[[common_styles.bold, common_styles.default_font_color]]}>Send {this.state.currency} to someone</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>

								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />

                <Form ref="register_form">
									<Item>
										<Input placeholder="Receiver's Address" autoCapitalize="none" onChange={(event) => this.setState({to_address: event.nativeEvent.text})} value={this.state.to_address}/>
										<TouchableOpacity onPress={()=>{this._open_scanner()}} style={common_styles.margin_r_20}>
											<FontAwesome name="qrcode" style={[styles.icon, common_styles.default_font_color]}/>
										</TouchableOpacity>
									</Item>
									<Item>
										<Input placeholder="Amount" keyboardType={'numeric'} autoCapitalize="none" onChange={(event) => this.setState({amount: event.nativeEvent.text})}/>
									</Item>
									<Item>
										<Input placeholder="Description" autoCapitalize="none" onChange={(event) => this.setState({description: event.nativeEvent.text})}/>
									</Item>
                </Form>

								<View style={[common_styles.view_align_center]}>
									<Button transparent style={common_styles.default_button}
											onPress={this._begin_send.bind(this)}
									>
										<Text style={[common_styles.whiteColor, common_styles.float_center]}>Send</Text>
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

export default SendCoin;
