/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, TouchableOpacity} from "react-native";

import {Container, Content, Text, Header, Body, Left, Right, Icon, Button} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import QRCodeImg from 'react-native-qrcode';
import firebase from 'react-native-firebase';
import Spinner from 'react-native-loading-spinner-overlay';

class QRCode extends BaseScreen {
	constructor(props) {
		super(props);
		this.ref = firebase.firestore();
		this.state = {
			address: '',	//hidden or real
			code: '',
			real_address: '',
			is_paid: false,
			loading_indicator_state: true,
			logined_user_id: ''
		};
	}
		//like onload event
		componentDidMount() {
			//check if user paid money, always get data from Firebase
			var user_collection = this.ref.collection(C_Const.COLLECTION_NAME.USER);
			var me = this;
			var logined_user_id = this.props.navigation.state.params.logined_user_id;
			// Utils.xlog('logined_user_id', logined_user_id);
			user_collection.doc(logined_user_id).get().then(function(querySnapshot) {
					if (querySnapshot.size == 0){
						//there is no user
						Utils.dlog('There is no user');
						me.setState({loading_indicator_state: false});
					} else {
						//there is user
						var real_address = me.props.navigation.state.params.address;
						if (!Utils.isEmpty(querySnapshot.data()['is_paid']) && querySnapshot.data()['is_paid']){
							//paid
							me.setState({
								real_address: real_address,
								address: real_address,
								code: me.props.navigation.state.params.code,
								is_paid: true, loading_indicator_state: false,
								logined_user_id: logined_user_id
							});
						} else {
							//unpaid, hide the address
							var hidden_address = real_address.substring(0, real_address.length - C_Const.HIDDEN_ADDRESS_POSTFIX.length) + C_Const.HIDDEN_ADDRESS_POSTFIX;
							me.setState({
								real_address: real_address,
								address: hidden_address,
								code: me.props.navigation.state.params.code,
								is_paid: false, loading_indicator_state: false,
								logined_user_id: logined_user_id
							});
						}
					}
				});
		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		}
		//
		_process_payment = () =>{
			this.props.navigation.navigate('Payment', {
				logined_user_id: this.state.logined_user_id,
				_user_paid: this._user_paid
			});
		}
		//trigger when user paid Paypal
		_user_paid = () => {
			//update DB
			var user_collection = this.ref.collection(C_Const.COLLECTION_NAME.USER);
			user_collection.doc(this.state.logined_user_id).update(
          {
            is_paid: true,
            paid_date: Utils.get_current_timestamp()
          }).catch(error => {

          });
			this.setState({address: this.state.real_address, is_paid: true});
		}
	 //==========
		render() {
				const {navigate} = this.props.navigation;

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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>My {this.state.code} Address</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
								<View style={common_styles.margin_t_20}/>
								<View style={common_styles.view_align_center}>
									<Text selectable style={styles.addr_str}>{this.state.address}</Text>
								</View>
								<View style={common_styles.margin_t_20}/>
								<View style={common_styles.view_align_center}>
									<QRCodeImg
										value={this.state.address}
										size={200}/>
								</View>
								{!this.state.is_paid &&
									<View>
										<View style={common_styles.margin_b_20} />
										<View style={[common_styles.view_align_center, common_styles.margin_t_20, common_styles.margin_b_20]}>
											<Text>Unlock your wallet address with only <Text style={common_styles.bold}>12 USD</Text>.</Text>
										</View>
										<View style={[common_styles.view_align_center, common_styles.margin_t_20, common_styles.margin_b_20]}>
											<Text>We accept Paypal, VISA & MASTER.</Text>
										</View>
										<View style={common_styles.margin_b_20} />
										<View style={common_styles.view_align_center}>
											<Button transparent style={[common_styles.default_button, {width:300}]}
												onPress={this._process_payment.bind(this)}
											>
												<Text style={[common_styles.whiteColor, common_styles.float_center]}>Pay once, use forever now >></Text>
											</Button>
										</View>
									</View>
								}
							</Content>
						</Container>
				);
		}
}

export default QRCode;
