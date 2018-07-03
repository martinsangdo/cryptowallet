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
					description: '',
				isSubmitting: false,
				err_mess: '',
				user_id: '',
				loading_indicator_state: false
			};
		}
		//
		componentDidMount() {
			this.setState({
				to_address: this.props.navigation.state.params.address,
				currency: this.props.navigation.state.params.code
			});
		}
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
		_begin_send = () => {
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

		};
		//after scanning qr code
		_scanned_qr = () => {

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
										<Text uppercase={false} style={[common_styles.default_font_color]}>Send coin</Text>
									</View>
								</Body>
								<Right style={[common_styles.headerRight]}>

								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />

                <Form ref="register_form">
									<Item>
										<Input placeholder="Receiver's Address" autoCapitalize="none" onChange={(event) => this.setState({to_address: event.nativeEvent.text})}/>
										<TouchableOpacity onPress={()=>{this._open_scanner()}} style={common_styles.margin_r_20}>
											<FontAwesome name="qrcode" style={[styles.icon, common_styles.default_font_color]}/>
										</TouchableOpacity>
									</Item>
									<Item>
										<Input placeholder="Amount" autoCapitalize="none" onChange={(event) => this.setState({amount: event.nativeEvent.text})}/>
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