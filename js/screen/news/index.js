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
				loading_indicator_state: false,
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
      <TouchableOpacity onPress={() => this._open_detail(item.index)}>
        <View style={styles.item_row}>
          <View>
            <Image style={styles.thumb} source={{uri: Utils.isEmpty(item.img_src)?null:item.img_src}}/>
          </View>
          <View style={styles.text_label}>
            <Text numberOfLines={3}>{item.title}</Text>
            <Text style={styles.time_label}>{item.date}</Text>
          </View>
					<View style={styles.forward_ico}>
						<Icon name="ios-arrow-forward" style={common_styles.darkGrayColor}/>
					</View>
        </View>
      </TouchableOpacity>
		);
		//get latest news
		_get_data = () => {
			this.setState({is_getting_data: true, loading_indicator_state: true}, () => {
				var url = API_URI.GET_NEWS_LIST + '&page=' + (this.state.offset / C_Const.PAGE_LEN + 1);
				Utils.dlog(url);
				RequestData.sentGetRequest(url,
					(list, error) => {
					if (list != null){
            // Utils.dlog(list);
						var me = this;
						var len = list.length;
            for (var i=0; i<len; i++){
              if (!me.state.key_list[list[i]['id']] || me.state.key_list[list[i]['id']]==null){
                // Utils.dlog(list[i]);
                me.state.data_list.push({
                    id: list[i]['id'],
                    index: me.state.data_list.length,
                    title: Utils.decodeHtml(list[i]['title']['rendered']),
                    img_src: C_Const.ICON_URL,
                    date: Utils.formatDatetime(list[i]['date']),
										link: list[i]['link'],
                    content: list[i]['content']['rendered']
                });
                me.state.key_list[list[i]['id']] = true;
                me._get_feature_media(me.state.data_list.length - 1, list[i]['_links']['wp:featuredmedia'][0]['href']);
              }
            }
						if (len < C_Const.PAGE_LEN){
							//no more
							this.setState({isShowMore: false, loading_indicator_state: false});
						} else {
							this.setState({isShowMore: true, loading_indicator_state: false});  //maybe have more
						}
					} else {
							// Utils.xlog('error', error);
							this.setState({isShowMore: false, loading_indicator_state: false});
					}
					this.setState({is_getting_data: false, loading_indicator_state: false});
				});
				//timeout of waiting request
				setTimeout(() => {
					if (this.state.loading_indicator_state){
						this.setState({loading_indicator_state: false});  //stop loading
					}
				}, C_Const.MAX_WAIT_RESPONSE);
			});
		};
    //get media list of a post
    _get_feature_media = (item_index, featured_media_url) => {
			console.log(featured_media_url);
      RequestData.sentGetRequest(featured_media_url,
        (detail, error) => {
					console.log(detail);
          if (!(Utils.isEmpty(detail) || Utils.isEmpty(detail['media_details']) || Utils.isEmpty(detail['media_details']['sizes']) ||
              Utils.isEmpty(detail['media_details']['sizes']['medium']) || Utils.isEmpty(detail['media_details']['sizes']['medium']['source_url']))){
            var medium_size_url = detail['media_details']['sizes']['medium']['source_url'];
            this.state.data_list[item_index]['img_src'] = medium_size_url;
            this.forceUpdate();
          }
        });
    };
		//
		_refresh_list = () => {

		};
    //
    _open_detail = (index) => {
      this.props.navigation.navigate('ArticleDetail', {
				detail: this.state.data_list[index],
			});
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
									<Text style={[common_styles.bold, common_styles.default_font_color]}>Latest news</Text>
								</Body>
								<Right style={[common_styles.headerRight, {flex:0.15}]}>
								</Right>
							</Header>
							{/* END header */}
							<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />

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
