import React, {Component} from "react";
import {View, TouchableOpacity, Share, Dimensions, Platform} from "react-native";

import {Container, Content, Button, Text, Header, Body, Left, Right, Icon} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const, C_MULTI_LANG} from '../../utils/constant';
import AutoHTML from 'react-native-autoheight-webview';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import RequestData from '../../utils/https/RequestData';
import {API_URI} from '../../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';
import {setting} from "../../utils/config";

class ArticleDetail extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				title: '',
				content: '',
				link: ''
			};
		}
		//
		componentDidMount() {
      var content = this.props.navigation.state.params.detail.content;
      content = content.replace('\r\n', '<br/>').replace('\n', '<br/>').replace('\r', '<br/>');
			this.setState({
				link: this.props.navigation.state.params.detail.link,
				title: this.props.navigation.state.params.detail.title,
        content: content
			});
		}
		//
		_on_go_back = () => {
			this.props.navigation.goBack();
		}
		//==========
		_share_link = () => {
				Share.share({
					title: this.state.title,
					message: this.state.link,
					// url: link,   //not work in FB app
					subject: 'Share Link' //  for email
				}, {
					// Android only:
					dialogTitle: 'Choose app'
			});
		};
	 //==========
		render() {
				return (
						<Container padder>
							<Header style={[common_styles.header, common_styles.whiteBg]}>
								<Left style={styles.left}>
									<TouchableOpacity onPress={() => this._on_go_back()}>
										<View style={styles.left_row}>
											<View style={[common_styles.float_center]}>
												<Icon name="ios-arrow-back-outline" style={common_styles.default_font_color}/>
											</View>
											<View style={[common_styles.margin_l_10, common_styles.float_center]}>
												<Text uppercase={false} style={[common_styles.default_font_color]}>Article</Text>
											</View>
										</View>
									</TouchableOpacity>
								</Left>
								<Right style={[common_styles.headerRight]}>
									<TouchableOpacity style={common_styles.margin_r_10} onPress={() => this._share_link()} style={{marginRight:10, justifyContent: 'flex-start', marginBottom:3}}>
										<SimpleLineIcons name="share" style={[common_styles.default_font_color, {fontSize:21}]}/>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this._toggle_bookmark()}>
										<MaterialIcons name={this.state.bookmark_id > 0?'star':'star-border'} style={[common_styles.default_font_color, {fontSize:27}]}/>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								{/* fake webview to auto calculate height */}
								<View>
										<AutoHTML
											autoHeight={true}
											scalesPageToFit={true}
											source={{html:''}} />
								</View>
								<View style={[common_styles.padding_20]}>
									<Text style={[common_styles.bold, {fontSize:18}]}>{this.state.title}</Text>
								</View>
								<View style={{margin:10}}>
									<AutoHTML
										scalesPageToFit={Platform.OS === 'android' ? true : false}
										autoHeight={true}
										style={{ width: Dimensions.get('window').width - 10 }}
										source={{baseUrl: '', html: this.state.content}}
										customStyle={'img {max-width:100%;height:auto;} body {font-family:arial;} p,span,a {font-size:13.5pt !important;}'} />
								</View>
							</Content>
						</Container>
				);
		}
}

export default ArticleDetail;
