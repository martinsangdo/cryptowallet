import React, {Component} from "react";
import {Image, View, TouchableOpacity, FlatList} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import {API_URI} from '../../utils/api_uri';
import store from 'react-native-simple-store';
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';
import RequestData from '../../utils/https/RequestData';
import Spinner from 'react-native-loading-spinner-overlay';

class Market extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				offset: 0,
				data_list: [],
				loading_indicator_state: true,
				isShowMore: false,
				total: 0,
				bookmarked_coins: {}
			};
		}
		//
		componentDidMount() {
			//get bookmarked icons
			var me = this;
			store.get(C_Const.STORE_KEY.BOOKMARKED_COINS)
			.then(saved_coins => {
				Utils.xlog('saved_coins', saved_coins.d);
				if (saved_coins!=null && saved_coins.d!=null){
					me.setState({bookmarked_coins: saved_coins.d});
				}
			});
			//get latest price from cache, if any
			store.get(C_Const.STORE_KEY.LATEST_PRICE_TIME)
			.then(saved_time => {
				if (saved_time!=null){
					//saved last time
					if (Utils.get_current_timestamp() - saved_time.t >= C_Const.LATEST_PRICE_CACHE_DURATION){
						me._get_data_tradingview();
					} else {
						//get data from cache
						store.get(C_Const.STORE_KEY.LATEST_PRICE_DATA)
						.then(saved_data => {
							if (saved_data!=null){
								//saved cache
								me.setState({data_list: saved_data.d,
									loading_indicator_state: false,
									total: saved_data.d.length,
									isShowMore:true,
									offset:saved_data.d.length>0?saved_data.d.length-1:0});
							} else {
								//no cache, get from server directly
								me._get_data_tradingview();
							}
						});
					}
				} else {
					//no cache, get from server directly
					me._get_data_tradingview();
				}
			});
		}
		//
		_keyExtractor = (item) => item.index;
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, item.idx%2==0 && styles.odd_item]} key={item.symbol}>
					<View style={styles.td_item_name}>
						<Text style={styles.coin_name}>{item.name}</Text>
						<Text>{item.symbol}</Text>
					</View>
					<Text style={styles.td_item_last}>{item.price}</Text>
					<Text style={styles.td_item}>{item.traded_volumn}</Text>
					<View style={[styles.td_item_last]}>
						<TouchableOpacity onPress={() => this._toggle_bookmark(item.symbol)}>
							<Text style={[common_styles.justifyCenter, styles.percent_change_down, (item.change >= 0) && styles.percent_change_up]}>{Utils.isEmpty(item.change)?'0':item.change}</Text>
						</TouchableOpacity>
					</View>
					<View>
						<TouchableOpacity onPress={() => this._toggle_bookmark(item.full_symbol)}>
						{this.state.bookmarked_coins[item.full_symbol] &&
							<Icon name="ios-bookmark" style={[common_styles.greenColor]}/>
						}
						{!this.state.bookmarked_coins[item.full_symbol] &&
							<Icon name="ios-bookmark" style={[common_styles.grayColor]}/>
						}
						</TouchableOpacity>
					</View>
				</View>
		);
		//
		_get_data_tradingview = () => {
			var params = {
					"filter": [
						{
							"left": "market_cap_calc",
							"operation": "nempty"
						},
						{
							"left": "sector",
							"operation": "nempty"
						},
						{
							"left": "name",
							"operation": "match",
							"right": "USD$"
						}
					],
					"options": {
						"lang": "en"
					},
					"columns": [
						"crypto_code",
						"sector",
						"close",
						"total_value_traded",
						"change"
						],
					"sort": {
						"sortBy": "market_cap_calc",
						"sortOrder": "desc"
					},
					"range": [
						this.state.offset,
						this.state.offset + C_Const.PAGE_LEN
					]
				};
				var extra_headers = {
					'Content-Type': 'application/json'
				};
				var me = this;
			this.setState({loading_indicator_state: true}, () => {
				Utils.xlog('Begin get price from server from offset: ', me.state.offset);
				RequestData.sentPostRequestWithExtraHeaders(API_URI.GET_CURRENT_PRICE,
					extra_headers, params, (detail, error) => {
						// Utils.xlog('detail', detail);
						if (detail){
							if (detail.totalCount){
								me.setState({total: detail.totalCount});
								var item;
								var len = 0;
								for (var i=0; i<detail.data.length; i++){
									item = detail.data[i].d;
									me.state.data_list.push({
										idx: me.state.data_list.length,	//index
										full_symbol: detail.data[i].s,	//"BITSTAMP:BTCUSD" used in Search
										index: item[0],
										name: item[1],
										symbol: item[0],
										price: Utils.number_to_float(item[2]),
										traded_volumn: Utils.shorten_big_num(item[3]),
										change: Utils.number_to_float(item[4])
									});
									len++;
								}
								//save to cache
								store.update(C_Const.STORE_KEY.LATEST_PRICE_DATA, {d:me.state.data_list});
								store.update(C_Const.STORE_KEY.LATEST_PRICE_TIME, {t: Utils.get_current_timestamp()});
								if (len < C_Const.PAGE_LEN){
									//no more
									this.setState({isShowMore: false});
								} else {
									this.setState({isShowMore: true});  //maybe have more
								}
							}
						} else if (error){
							me.setState({isShowMore: false});
						}
						me.setState({loading_indicator_state: false});
					});
			});
			//timeout of waiting request
			setTimeout(() => {
				if (this.state.loading_indicator_state){
					this.setState({loading_indicator_state: false});  //stop loading
				}
			}, C_Const.MAX_WAIT_RESPONSE);
		}
		//
		_load_more = () => {
			if (!this.state.loading_indicator_state && this.state.isShowMore){
				this.setState({offset: this.state.offset + C_Const.PAGE_LEN}, () => {
					this._get_data_tradingview();
				});
			}
		};
		//
		_open_search = () => {

		};
		//
		_refresh_list = () =>{};
		//set/remove symbol
		_toggle_bookmark = (full_symbol) =>{
			if (this.state.loading_indicator_state){
				return;
			}
			var bookmarked_coins = Utils.cloneObj(this.state.bookmarked_coins);
			bookmarked_coins[full_symbol] = !bookmarked_coins[full_symbol];
			var me = this;
			//save back to store
			store.update(C_Const.STORE_KEY.BOOKMARKED_COINS, {d:bookmarked_coins});
			this.setState({loading_indicator_state: true, bookmarked_coins: bookmarked_coins}, () => {
				setTimeout(() => {
					me.setState({loading_indicator_state: false});  //stop loading
				}, 200);
			});
		}
		//
		_open_bookmark_page = () =>{
			this.props.navigation.navigate('Bookmark', {
				bookmarked_coins: this.state.bookmarked_coins
			});
		}
		//==========
		render() {
			{/* define how to render country list */}

				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Current market</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
									<TouchableOpacity onPress={() => this._open_bookmark_page()}>
										<Icon name="ios-bookmark" style={[common_styles.greenColor]}/>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
							<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
							<View style={{height:25, justifyContent: 'center', flexDirection: 'row'}}>
								<Text style={styles.coin_name}>Click coin name to view detail</Text>
							</View>
							<View style={[styles.tbl_header, common_styles.mainColorBg]}>
								<Text style={[styles.td_item_name, common_styles.bold]}>Name</Text>
								<View style={[styles.td_item_last]}>
									<Text style={[common_styles.bold]}>Price</Text>
									<Text>USD</Text>
								</View>
								<Text style={[styles.td_item, common_styles.bold]}>Traded Vol</Text>
								<View style={[styles.td_item_last]}>
									<Text style={[common_styles.bold]}>Change</Text>
									<Text>%</Text>
								</View>
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
