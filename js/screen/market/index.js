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
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class Market extends BaseScreen {
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
			//get top chart
			this._get_price();
		}
		//
		_keyExtractor = (item) => item.index;
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row]}>
					<Text style={styles.td_item}>{item.name}</Text>
					<Text style={styles.td_item}>{item.symbol}</Text>
					<Text style={styles.td_item}>{item.price}</Text>
					<Text style={styles.td_item}>{item.change}</Text>
				</View>
		);
		//get latest price
		_get_price = () => {
			var url = API_URI.GET_CURRENT_PRICE + '&offset=' + this.state.offset;
				RequestData.sentGetRequest(url,
					(detail, error) => {
					if (detail != null && detail.data != null){
						var list = detail.data;
						var me = this;
						Object.keys(list).forEach(function(id) {
							var coin_info = list[id];
								me.state.data_list.push({
									index: coin_info.id,
									name: coin_info.name,
									symbol: coin_info.symbol,
									price: coin_info.quotes['USD']['price'],
									change: coin_info.quotes['USD']['percent_change_1h']
								});
						});
					} else {
							// Utils.xlog('error', error);
					}
					this.setState({loading_indicator_state: false});
				});
		};
		//
		_refresh_list = () => {

		};
		//
		_load_more = () => {

		};
		//==========
		render() {
			{/* define how to render country list */}

				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={common_styles.bold}>Latest price</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Content>
							<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
							<View style={[styles.tbl_header]}>
								<Text style={styles.td_item}>Name</Text>
								<Text style={styles.td_item}>Symbol</Text>
								<Text style={styles.td_item}>Price (USD)</Text>
								<Text style={styles.td_item}>Change 24h</Text>
							</View>

							<FlatList
											data={this.state.data_list}
											renderItem={this._renderItem}
											refreshing={false}
											onRefresh={() => this._refresh_list()}
											onEndReachedThreshold={0.5}
											keyExtractor={this._keyExtractor}
											onEndReached={({ distanceFromEnd }) => this._load_more()}
										/>
							</Content>
						</Container>
				);
		}
}

export default Market;
