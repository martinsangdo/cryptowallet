/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, TouchableOpacity} from "react-native";

import {Container, Content, Text, Header, Body, Left, Right, Icon} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import QRCodeImg from 'react-native-qrcode';

class QRCode extends BaseScreen {
	constructor(props) {
		super(props);
		this.state = {
			address: '',
			code: ''
		};
	}
		//like onload event
		componentDidMount() {
			this.setState({
				address: this.props.navigation.state.params.address,
				code: this.props.navigation.state.params.code
			});
		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
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
											<Icon name="ios-arrow-back-outline" style={common_styles.default_font_color}/>
										</View>
									</View>
								</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={[common_styles.bold, common_styles.default_font_color]}>{this.state.code} Address</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								<View style={common_styles.margin_t_20}/>
								<View style={common_styles.view_align_center}>
									<Text style={styles.addr_str}>{this.state.address}</Text>
								</View>
								<View style={common_styles.margin_t_20}/>
								<View style={common_styles.view_align_center}>
									<QRCodeImg
										value={this.state.address}
										size={200}/>
								</View>
							</Content>
						</Container>
				);
		}
}

export default QRCode;
