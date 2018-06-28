import React, {Component} from "react";
import {View, TouchableOpacity, Share, Dimensions, Platform, TextInput} from "react-native";

import {Container, Content, Button, Text, Header, Body, Left, Right, Icon, Form} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const, C_MULTI_LANG} from '../../utils/constant';
import AutoHTML from 'react-native-autoheight-webview';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import store from 'react-native-simple-store';

import RequestData from '../../utils/https/RequestData';
import {API_URI} from '../../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';
import {setting} from "../../utils/config";

class CreateAccount extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				title: '',
				content: '',
				link: '',
        fields: {		//values in form
  				mnemonic: '',
  				password: '',
  				email: ''
  			},
			};
		}
		//
		componentDidMount() {

		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		}
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
											<View style={[common_styles.margin_l_10, common_styles.float_center]}>
												<Text uppercase={false} style={[common_styles.default_font_color]}>Create new wallet</Text>
											</View>
										</View>
									</TouchableOpacity>
								</Left>
								<Right style={[common_styles.headerRight]}>

								</Right>
							</Header>
							{/* END header */}
							<Content>
                <Form ref="register_form">
                  <View style={common_styles.margin_t_5_ios_border} />
                  <View style={common_styles.txt_item_center}>
                    <Text style={[common_styles.blueColor, common_styles.float_left, styles.txt_label]}>Password (*)</Text>
                  </View>
                  <View style={common_styles.margin_b_5_ios} />
                  <View style={common_styles.txt_item_center_row}>
                      <Body style={common_styles.flex_100p}><TextInput ref='password' returnKeyType = {"next"} style={common_styles.text_input}
                      onSubmitEditing={() => this.focusTextInput('mnemonic')}
                       placeholder={'Password'} autoCapitalize="none" secureTextEntry={true} onChange={(event) => this.setState({fields: {...this.state.fields, password : event.nativeEvent.text}})}/></Body>
                  </View>
                  <View style={common_styles.margin_t_5_ios_border} />
                  <View style={common_styles.txt_item_center}>
                    <Text style={[common_styles.blueColor, common_styles.float_left, styles.txt_label]}>Mnemonic</Text>
                  </View>
                  <View style={common_styles.txt_item_center_row}>
                      <Body style={common_styles.flex_100p}><TextInput ref='mnemonic' returnKeyType = {"next"} style={[common_styles.text_input]}
                       placeholder={'Mnemonic'} autoCapitalize="none" secureTextEntry={true} onChange={(event) => this.setState({fields: {...this.state.fields, mnemonic : event.nativeEvent.text}})}/></Body>
                  </View>
                </Form>
							</Content>
						</Container>
				);
		}
}

export default CreateAccount;
