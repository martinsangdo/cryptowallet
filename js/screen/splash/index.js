/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, Platform, Alert, NetInfo} from "react-native";

import {Container, Button, Text, Header, Title, Body, Left, Right} from "native-base";
import {NavigationActions} from "react-navigation";
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

import BaseScreen from "../../base/BaseScreen.js";
import {API_URI} from '../../utils/api_uri';

import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import RNExitApp from 'react-native-exit-app';
import RequestData from '../../utils/https/RequestData';
import DeviceInfo from 'react-native-device-info';
import store from 'react-native-simple-store';

const launchscreenLogo = require("../../../img/logo.png");

class Splash extends BaseScreen {
	constructor(props) {
		super(props);
		this.state = {
			user_info: {},
			is_got_firebase_token: false,   //firebase token
		};
	}
		//like onload event
		componentDidMount() {
			setTimeout(() => {
				this._navigateTo('Main');
			}, C_Const.SPLASH_TIMER);
		}
	 //==========
		render() {
				const {navigate} = this.props.navigation;

				return (
						<Container>
								<View style={[common_styles.mainGreenBg, styles.container]}>
										<Image source={launchscreenLogo} style={styles.logo}/>
								</View>
						</Container>
				);
		}
}

export default Splash;
