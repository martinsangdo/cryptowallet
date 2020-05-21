import React, {Component} from "react";
import {View, TouchableOpacity} from "react-native";

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

class Signup extends BaseScreen {
		constructor(props) {
			super(props);
			this.ref = firebase.firestore();
			this.state = {
  			email: '',
				isSubmitting: false,
				err_mess: '',
				loading_indicator_state: false
			};
		}
		//
		componentDidMount() {
		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		};
		//check if all input values are valid
		_is_valid_input(){
			var all_valid = false;
			if (Utils.trim(this.state.email) == ''){
				this.setState({err_mess: C_Const.TEXT.ERR_EMPTY_EMAIL});
			} else if (!Utils.validateEmail(this.state.email)){
				this.setState({err_mess: C_Const.TEXT.ERR_WRONG_EMAIL});
			} else {
				all_valid = true;
			}
			return all_valid;
		};
		//user clicks Reset pass
		_reset_pass = () => {
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
			//check if email existed
			var collection_user = this.ref.collection(C_Const.COLLECTION_NAME.USER);
			collection_user.where('email', '==', Utils.trim(this.state.email))
	    .get().then(function(querySnapshot) {
					if (querySnapshot.size == 0){
						//email not existed
						me.setState({err_mess: C_Const.TEXT.ERR_NON_EXISTED_EMAIL, isSubmitting: false, loading_indicator_state: false});
					} else {
						var collection_reset_pass = me.ref.collection(C_Const.COLLECTION_NAME.FORGOT_PASS);
						//email existed, save log to reset it to DB
						collection_reset_pass.add({
								email: Utils.trim(me.state.email),
								create_time: Utils.formatDatetime(Date.now())
						})
						.then(function(docRef) {
								//saved
								me.setState({err_mess: C_Const.TEXT.MESS_RESET_OK, isSubmitting: false, loading_indicator_state: false});
						})
						.catch(function(error) {
								me.setState({err_mess: C_Const.TEXT.ERR_SERVER, isSubmitting: false, loading_indicator_state: false});
						});
						//todo: send reset email to user

					}
	    })
	    .catch(function(error) {
					me.setState({err_mess: C_Const.TEXT.ERR_SERVER, isSubmitting: false, loading_indicator_state: false});
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
									<View style={[common_styles.margin_l_10, common_styles.float_center]}>
										<Text uppercase={false} style={[common_styles.bold, common_styles.default_font_color]}>Reset password</Text>
									</View>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>

								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />

                <Form ref="register_form">
									<Item>
										<Input placeholder="Email" keyboardType={'email-address'} autoCapitalize="none" onChange={(event) => this.setState({email : event.nativeEvent.text})}/>
									</Item>
                </Form>

								<View style={[common_styles.view_align_center]}>
									<Button transparent style={common_styles.default_button}
											onPress={this._reset_pass.bind(this)}
									>
										<Text style={[common_styles.whiteColor, common_styles.float_center]}>Reset</Text>
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

export default Signup;
