import React, {Component} from "react";
import {View, TouchableOpacity, WebView} from "react-native";

import {Container, Content, Button, Text, Header, Body, Left, Right, Icon, Form,Item,Input} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import store from 'react-native-simple-store';
import firebase from 'react-native-firebase';

import {API_URI} from '../../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';
import {setting} from "../../utils/config";

class Payment extends BaseScreen {
		constructor(props) {
			super(props);
			this.ref = firebase.firestore();
			this.state = {
				uri: 'https://otcmarket.herokuapp.com/payment/paypal_button',
				loading_indicator_state: true,
				logined_user_id: ''
			};
		}
		//
		componentDidMount() {
			this.setState({logined_user_id: this.props.navigation.state.params.logined_user_id});
			setTimeout(() => {
				this._close_spinner();	//prevent loading forever
			}, 10000);
		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		};
		//
		//close spinner after page loading
	_close_spinner = () => {
		this.setState({
			loading_indicator_state: false
		});
	};
	//
	_start_spinner = () => {
		this.setState({
			loading_indicator_state: true
		});
		setTimeout(() => {
			this._close_spinner();	//prevent loading forever
		}, 15000);
	};
	//
	_onNavigationStateChange = (event) => {
		// Utils.dlog('_onNavigationStateChange '+event.url);
		if (event.url.indexOf("paypal.com/") >= 0 && event.url.indexOf("/checkout/done") >= 0){
			//user paid
			this.props.navigation.state.params._user_paid();
			setTimeout(() => {
				this._on_go_back();
			}, 5000);
		}
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
											<View style={[common_styles.margin_l_10, common_styles.float_center]}>
												<Text uppercase={false} style={[common_styles.default_font_color]}>Back</Text>
											</View>
										</View>
									</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<View style={[common_styles.margin_l_10, common_styles.float_center]}>
										<Text uppercase={false} style={[common_styles.bold, common_styles.default_font_color]}>Payment</Text>
									</View>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>

								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />

								<View style={styles.container}>
									<WebView
										ref={'WEBVIEW_REF'}
										source={{uri: this.state.uri}}
										style={styles.webview}
										onLoadEnd={this._close_spinner}
										onLoadStart={this._start_spinner}
										onNavigationStateChange={this._onNavigationStateChange}
									/>
								</View>
							</Content>
						</Container>
				);
		}
}

export default Payment;
