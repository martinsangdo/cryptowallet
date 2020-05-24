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

class Bookmark extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				data_list: [],
				bookmarked_coins: {},	//get from Homepage or cache
				loading_indicator_state: true
			};
		}
		//
		componentDidMount() {
			var bookmarked_coins = this.props.navigation.state.params.bookmarked_coins;
			// Utils.xlog('params', bookmarked_coins);
			var me = this;
			if (bookmarked_coins == null){
				//try to get from cache
				store.get(C_Const.STORE_KEY.BOOKMARKED_COINS)
				.then(saved_coins => {
					if (saved_coins!=null && saved_coins.d!=null){
						me.setState({bookmarked_coins: saved_coins.d}, ()=>{
							var coin_list = [];
							Object.keys(saved_coins.d).forEach(function(full_symbol) {
						      if (saved_coins.d[full_symbol]){
										coin_list.push(full_symbol);
									}
						  });
							me._get_data_tradingview(coin_list, coin_list.length);
						});
					} else {
						me.setState({loading_indicator_state: false});
					}
				});
			} else {
				this.setState({bookmarked_coins: bookmarked_coins}, ()=>{
					var coin_list = [];
					Object.keys(bookmarked_coins).forEach(function(full_symbol) {
							if (bookmarked_coins[full_symbol]){
								coin_list.push(full_symbol);
							}
					});
					me._get_data_tradingview(coin_list, coin_list.length);
				});
			}
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
		_get_data_tradingview = (coin_list, coin_list_length) => {
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
					"symbols": {
				    "query": {
				      "types": []
				    },
				    "tickers":
				      coin_list
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
						0,
						coin_list_length
					]
				};
				var extra_headers = {
					'Content-Type': 'application/json'
				};
				var me = this;
				RequestData.sentPostRequestWithExtraHeaders(API_URI.GET_CURRENT_PRICE,
					extra_headers, params, (detail, error) => {
						// Utils.xlog('detail', detail);
						if (detail){
							if (detail.totalCount){
								me.setState({total: detail.totalCount});
								var item;
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
								}
							}
						} else if (error){
							me.setState({isShowMore: false});
						}
						me.setState({loading_indicator_state: false});
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

		};
		//
		_open_search = () => {

		};
		//
		_refresh_list = () =>{};
		_on_go_back = () => {
			this.props.navigation.goBack();
		}
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
				//clear UI
				var new_data_list = me.state.data_list;
				for (var i=new_data_list.length-1; i>=0; i--){
					if (new_data_list[i]['full_symbol'] == full_symbol){
						Utils.removeArrayAtIndex(new_data_list, i);
					}
				}
				me.setState({data_list: new_data_list});
				//inform Homepage
				me.props.navigation.state.params._update_bookmarked_coins(bookmarked_coins);
				//
				setTimeout(() => {
					me.setState({loading_indicator_state: false});  //stop loading
				}, 200);
			});
		}
		//==========
		render() {
			{/* define how to render country list */}

				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
								<TouchableOpacity onPress={() => this._on_go_back()}>
									<View style={styles.left_row}>
										<View style={[common_styles.float_center]}>
											<Icon name="ios-arrow-back" style={common_styles.default_font_color}/>
										</View>
										<View style={[common_styles.margin_l_10, common_styles.float_center]}>
											<Text uppercase={false} style={[common_styles.default_font_color]}>Back</Text>
										</View>
									</View>
								</TouchableOpacity>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Bookmarked coins</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
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

export default Bookmark;
