import React, {Component} from "react";
import {View, TouchableOpacity, Share, Dimensions, FlatList} from "react-native";

import {Container, Content, Button, Text, Header, Body, Left, Right, Icon} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const} from '../../utils/constant';

import RequestData from '../../utils/https/RequestData';
import {API_URI} from '../../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';

class CoinDetail extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				full_symbol: '',
				name: '',
				loading_indicator_state: true,
				data_list: []
			};
		}
		//
		componentDidMount() {
      var full_symbol = this.props.navigation.state.params.full_symbol;
			if (!Utils.isEmpty(full_symbol)){
				this.setState({full_symbol:full_symbol, name: this.props.navigation.state.params.name},()=>{
					this._load_data(full_symbol);
				});
			} else {
				this.setState({loading_indicator_state:false});
			}
		}
		//
		_keyExtractor = (item) => item.idx;
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
				<View style={[styles.list_item, common_styles.fetch_row, item.idx%2==0 && styles.odd_item]} key={item.idx}>
					<Text style={styles.td_item}>{item.date}</Text>
					<Text style={styles.td_item}>{item.price}</Text>
					<Text style={styles.td_item}>{item.traded_volumn}</Text>
				</View>
		);
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		}
		//
		_load_data = (full_symbol) =>{
			var current_time = Math.floor(Utils.get_current_timestamp()) / 1000;
			var url = 'https://query1.finance.yahoo.com/v7/finance/download/'+full_symbol+
			'?period1='+(current_time-C_Const.HISTORY_PRICE_DURATION)+
			'&period2='+current_time+'&interval=1d&events=history';
			// Utils.xlog('url', url);
			RequestData.sentPlainGetRequest(url, (detail, error) => {
					//parse data
					if (!Utils.isEmpty(detail)){
						var history_list_lines = detail.split('\n');
						// Utils.xlog('history_list_lines', history_list_lines);
						for (var i=history_list_lines.length - 1; i>0; i--){
							if (!Utils.isEmpty(history_list_lines[i])){
								item = history_list_lines[i].split(',');
								if (item.length >= 7){
									this.state.data_list.push({
										idx: i,	//index
										key: item[0],	//date
										date: item[0],
										price: Utils.number_to_float(parseFloat(item[4])),
										traded_volumn: Utils.shorten_big_num(parseFloat(item[6]))
									});
								}
							}
						}
					}
					this.setState({loading_indicator_state:false});
				});
				//timeout of waiting request
				setTimeout(() => {
					if (this.state.loading_indicator_state){
						this.setState({loading_indicator_state: false});  //stop loading
					}
				}, C_Const.MAX_WAIT_RESPONSE);
		}
		_load_more = () => {

		};
		//
		_refresh_list = () =>{};
	 //==========
		render() {
				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={styles.left}>
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>{this.state.name}</Text>
								</Body>
							</Header>
							{/* END header */}
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
								{/* fake webview to auto calculate height */}
								<View style={[common_styles.padding_20]}>
									<Text style={[common_styles.bold, {fontSize:18}]}>Historial Price in past 90 days</Text>
								</View>
								<View style={[styles.tbl_header, common_styles.mainColorBg]}>
									<Text style={[styles.td_item, common_styles.bold]}>Date</Text>
									<Text style={[styles.td_item, common_styles.bold]}>Price (USD)</Text>
									<Text style={[styles.td_item, common_styles.bold]}>Traded Vol</Text>
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

export default CoinDetail;
