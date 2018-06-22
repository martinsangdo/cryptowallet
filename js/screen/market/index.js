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
				jwt: '',
				key_list: {}		//to make sure there is no duplicate coin in list
			};
		}
		//
		componentDidMount() {
			//get top chart
			this._get_price(0);
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
			this.setState({loading_indicator_state: true}, () => {
				var url = API_URI.GET_CURRENT_PRICE + '&start=' + this.state.offset;
				// Utils.dlog(url);
				RequestData.sentGetRequest(url,
					(detail, error) => {
					if (detail != null && detail.data != null){
						var list = detail.data;
						var me = this;
						var len = 0;
						Object.keys(list).forEach(function(id) {
							var coin_info = list[id];
							if (!me.state.key_list[id] || me.state.key_list[id]==null){
								me.state.data_list.push({
									index: coin_info.id,
									name: coin_info.name,
									symbol: coin_info.symbol,
									price: coin_info.quotes['USD']['price'],
									change: coin_info.quotes['USD']['percent_change_1h']
								});
								me.state.key_list[id] = true;
							}
							len++;
						});
						if (len < C_Const.PAGE_LEN){
							//no more
							this.setState({isShowMore: false});
						} else {
							this.setState({isShowMore: true});  //maybe have more
						}
					} else {
							// Utils.xlog('error', error);
							this.setState({isShowMore: false});
					}
					this.setState({loading_indicator_state: false});
				});
			});
		};
		//
		_refresh_list = () => {

		};
		//
		_load_more = () => {
			if (!this.state.loading_indicator_state && this.state.isShowMore){
				this.setState({offset: this.state.offset + C_Const.PAGE_LEN}, () => {
					this._get_price();
				});
			}
		};
		//
		_open_search = () => {

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
									<Button
										transparent
										onPress={() => this._open_search()}
									>
										<Icon name="search" style={styles.header_icon}/>
									</Button>
								</Right>
							</Header>
							{/* END header */}
							<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
							<View style={[styles.tbl_header]}>
								<Text style={styles.td_item}>Name</Text>
								<Text style={styles.td_item}>Symbol</Text>
								<Text style={styles.td_item}>Price (USD)</Text>
								<Text style={styles.td_item}>Change 24h</Text>
							</View>
							<View style={{flex:1}}>
								<FlatList
											data={this.state.data_list}
											renderItem={this._renderItem}
											refreshing={false}
											onRefresh={() => this._refresh_list()}
											onEndReachedThreshold={0.5}
											keyExtractor={this._keyExtractor}
											onEndReached={({ distanceFromEnd }) => this._load_more()}
											initialNumToRender={20}
										/>
							</View>
						</Container>
				);
		}
}

export default Market;