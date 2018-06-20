import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity, FlatList, ScrollView, Share, Alert} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon} from "native-base";
import {NavigationActions} from "react-navigation";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import {API_URI} from '../../utils/api_uri';
import store from 'react-native-simple-store';
import RNExitApp from 'react-native-exit-app';

import Utils from "../../utils/functions";
import {C_Const, C_MULTI_LANG} from '../../utils/constant';
import RequestData from '../../utils/https/RequestData';
import Spinner from 'react-native-loading-spinner-overlay';

class Home extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				offset: 0,
				data_list: [],
				loading_indicator_state: true,
				isShowMore: false,
				jwt: ''
			};
		}
		//
		componentDidMount() {
			//get language
		}
		//==========
		render() {
			{/* define how to render country list */}

				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
									<Button
										transparent
										onPress={() => this._open_filter()}
									>
										<Icon name="menu" style={styles.header_icon}/>
									</Button>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={common_styles.bold}>Home</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
									<Button
										transparent
										onPress={() => this._open_search()}
									>
										<Icon name="search" style={styles.header_icon}/>
									</Button>
								</Right>
							</Header>
							{/* END header */}
							{/* FlatList has no props bounces for refreshing in iOS */}
							<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
						</Container>
				);
		}
}

export default Home;
