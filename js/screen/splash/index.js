/*
* author: Martin SangDo
*/
import React, {Component} from "react";
import {Image, View, Platform, Alert, NetInfo} from "react-native";

import {Container} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import RNExitApp from 'react-native-exit-app';
import RequestData from '../../utils/https/RequestData';
import DeviceInfo from 'react-native-device-info';
import store from 'react-native-simple-store';
import firebase from 'react-native-firebase';

const launchscreenLogo = require("../../../img/logo.png");

class Splash extends BaseScreen {
	constructor(props) {
		super(props);
		this.ref = firebase.firestore().collection(C_Const.COLLECTION_NAME.ACCOUNT);
		this.state = {
		};
	}
		//like onload event
		componentDidMount() {
			//check Internet connection
			NetInfo.getConnectionInfo().then((connectionInfo) => {
				if (connectionInfo.type == 'none'){
					//device is offline
					Alert.alert(
						'Alert',
						C_Const.TEXT.ERR_OFFLINE,
						[
							{text: 'OK', onPress: () => RNExitApp.exitApp()},
						],
						{ cancelable: false }
					);
				} else {
					//online, get list of activating coin
					this._get_active_coin_list();
				}
			});
		}
		//
		//get list of activating coins from DB
		_get_active_coin_list = () => {
			var me = this;
			this.ref.where('is_active', '==', true).get().then(function(querySnapshot) {
					if (querySnapshot.size == 0){
						//there is no any coin
						Utils.dlog('There is no coin');
						//cannot get any coin
						Alert.alert(
							'Alert',
							C_Const.TEXT.ERR_SERVER,
							[
								{text: 'OK', onPress: () => RNExitApp.exitApp()},
							],
							{ cancelable: false }
						);
					} else {
						//there is coin, save them to store
						var coin_list = {};
						querySnapshot.forEach(function(doc) {
							coin_list[doc.id] = doc.data();
				 		});
						//save to store
						store.update(C_Const.STORE_KEY.COIN_LIST, coin_list);
						//verify it's saved into Store
						setTimeout( () => {		//to make sure it's saved
							store.get(C_Const.STORE_KEY.COIN_LIST)
							.then(res => {
								if (res!=null){
									//saved
									setTimeout(() => {
										me._navigateTo('Main');
									}, C_Const.SPLASH_TIMER);
								} else {
									//not saved, don't know why
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
						}, 100);
					}
				});
		};
	 //==========
		render() {
				const {navigate} = this.props.navigation;

				return (
						<Container>
								<View style={[common_styles.mainColorBg, styles.container]}>
										<Image source={launchscreenLogo} style={styles.logo}/>
								</View>
						</Container>
				);
		}
}

export default Splash;
