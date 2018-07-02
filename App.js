/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Root, Icon, Badge} from "native-base";
import {
		Platform,
		StyleSheet,
		Text,
		View, Image
} from 'react-native';

import {
		StackNavigator, TabNavigator
} from 'react-navigation';
import common_styles from "./css/common";
import {C_Const, C_MULTI_LANG} from './js/utils/constant';
import Utils from "./js/utils/functions";

import store from 'react-native-simple-store';
import TabLabel from './js/plugin/tab_label'
//define screens
import BaseScreen from "./js/base/BaseScreen"
import Splash from "./js/screen/splash";
import Market from "./js/screen/market";
import News from "./js/screen/news";
import Wallet from "./js/screen/wallet";
import Setting from "./js/screen/setting";
import ArticleDetail from "./js/screen/news/detail";
import Signup from "./js/screen/wallet/signup";
import CreateWallet from "./js/screen/wallet/create";
import Login from "./js/screen/wallet/login";


import FontAwesome from 'react-native-vector-icons/FontAwesome';

//https://github.com/react-navigation/react-navigation/issues/628
const AppNavigator = StackNavigator({
				BaseScreen: {screen: BaseScreen},
				Splash: {screen: Splash},
				Market: {screen: Market},
				Wallet: {screen: Wallet},
				News: {screen: News},
				Setting: {screen: Setting},
				ArticleDetail: {screen: ArticleDetail},
				Login: {screen: Login},
				Signup: {screen: Signup},
				CreateWallet: {screen: CreateWallet},
				//define tab bar
				Main: {
					screen: TabNavigator({
						Market: {   //tab 1
								screen: Market,
								navigationOptions: ({ navigation, screenProps }) => ({
										tabBarIcon: ({ tintColor }) => (
											<FontAwesome name="area-chart" style={{color:tintColor}}/>
										),
								})
						},
						News: {   //tab 2
							screen: News,
							navigationOptions: ({ navigation, screenProps }) => ({
									tabBarIcon: ({ tintColor }) => (
										<FontAwesome name="newspaper-o" style={{color:tintColor}}/>
									),
							})
						},
						Wallet: {   //tab 3
								screen: Wallet,
								navigationOptions: ({ navigation, screenProps }) => ({
										tabBarIcon: ({ tintColor }) => (
											<FontAwesome name="google-wallet" style={{color:tintColor}}/>
										),
								})
						},
						Setting: {   //tab 4
								screen: Setting,
								navigationOptions: ({ navigation, screenProps }) => ({
										tabBarIcon: ({ tintColor }) => (
											<Icon name="ios-settings" style={{color:tintColor, fontSize:16}}/>
										),
								})
						}
					},
					{
							tabBarPosition: 'bottom',
							swipeEnabled: false,

							tabBarOptions: {
									activeTintColor: '#008da9',
									inactiveTintColor: '#777',
									// animationEnabled:false,
									swipeEnabled:false,
									showIcon: true,
									showLabel: true,
									uppercase: false,
									indicatorStyle: {backgroundColor: "#008da9"},
									pressColor: "#008da9",
									style: {
											backgroundColor: 'white',
											height:50, paddingBottom: Platform.OS==='ios'?10:0
									},
									// navigation: this.props.navigation,
									labelStyle: {fontSize: 9, marginTop: 2},
									lazy: false   // IMPORTANT: if lazy: true -> setParam will only apply to selected tab (since only this one is rendered)
							}
					}
					)
				}
		},
		{
				initialRouteName: "Wallet",   //open this page first time
				headerMode: "none",
				cardStyle: {
					paddingTop: 0,
					backgroundColor: '#fff'
				}
		});

export default class App extends Component{
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		console.ignoredYellowBox = ['Remote debugger'];   //don't show warning in app when debugging
	}
	//
	render() {
		return (
			<Root>
					<AppNavigator/>
			</Root>
		)
	}
}
