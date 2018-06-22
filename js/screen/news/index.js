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

class News extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				offset: 0,
				data_list: [],
				is_getting_data: true,
				isShowMore: false,
				jwt: '',
				key_list: {}		//to make sure there is no duplicate item in list
			};
		}
		//
		componentDidMount() {
			//get top chart
			this._get_data(0);
		}
		//
		_keyExtractor = (item) => item.id;
		//render the list. MUST use "item" as param
		_renderItem = ({item}) => (
      <TouchableOpacity onPress={() => this._open_detail(item.id)}>
        <View style={styles.item_row}>
          <View>
            <Image style={styles.thumb} source={{uri: Utils.isEmpty(item.img_src)?null:item.img_src}}/>
          </View>
          <View style={styles.text_label}>
            <Text numberOfLines={3}>{item.title}</Text>
            <Text style={styles.time_label}>{item.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
		);
		//get latest news
		_get_data = () => {
			this.setState({is_getting_data: true}, () => {
				var url = API_URI.GET_NEWS_LIST + '&page=' + (this.state.offset / C_Const.PAGE_LEN + 1);
				// Utils.dlog(url);
				RequestData.sentGetRequest(url,
					(list, error) => {
					if (list != null){
            // Utils.dlog(list);
						var me = this;
						var len = list.length;
            for (var i=0; i<len; i++){
              if (!me.state.key_list[list[i]['id']] || me.state.key_list[list[i]['id']]==null){
                Utils.dlog(list[i]);
                me.state.data_list.push({
                    id: list[i]['id'],
                    title: Utils.decodeHtml(list[i]['title']['rendered']),
                    img_src: C_Const.ICON_URL,
                    date: Utils.formatDatetime(list[i]['date'])
                });
                me.state.key_list[list[i]['id']] = true;
              }
            }
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
					this.setState({is_getting_data: false});
				});
			});
		};
		//
		_refresh_list = () => {

		};
    //
    _open_detail = () => {

    };
		//
		_load_more = () => {
			if (!this.state.is_getting_data && this.state.isShowMore){
				this.setState({offset: this.state.offset + C_Const.PAGE_LEN}, () => {
					this._get_data();
				});
			}
		};
		//==========
		render() {
				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={[common_styles.headerLeft, {flex:0.15}]}>
								</Left>
								<Body style={styles.headerBody}>
									<Text style={common_styles.bold}>Latest news</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
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

export default News;
