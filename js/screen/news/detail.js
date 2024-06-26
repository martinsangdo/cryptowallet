import React, {Component} from "react";
import {View, TouchableOpacity, Share, Dimensions, Platform} from "react-native";

import {Container, Content, Button, Text, Header, Body, Left, Right, Icon} from "native-base";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import AutoHTML from 'react-native-autoheight-webview';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import Spinner from 'react-native-loading-spinner-overlay';

class ArticleDetail extends BaseScreen {
		constructor(props) {
			super(props);
			this.state = {
				title: '',
				content: '',
				link: '',
				is_bookmarked: false,
				loading_indicator_state: true
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
			}, ()=>{
				//wait content to render
				setTimeout(()=>{
					this.setState({loading_indicator_state:false});
				}, 3000);
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
												<Icon name="ios-arrow-back" style={common_styles.default_font_color}/>
											</View>
											<View style={[common_styles.margin_l_10, common_styles.float_center]}>
												<Text uppercase={false} style={[common_styles.default_font_color]}>Back</Text>
											</View>
										</View>
									</TouchableOpacity>
								</Left>
								<Right style={[common_styles.headerRight]}>
									<TouchableOpacity style={common_styles.margin_r_10} onPress={() => this._share_link()} style={{marginRight:10, justifyContent: 'flex-start', marginBottom:3}}>
										<SimpleLineIcons name="share" style={[common_styles.default_font_color, {fontSize:21}]}/>
									</TouchableOpacity>
								</Right>
							</Header>
							{/* END header */}
							<Content>
								<Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
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
										customStyle={'img {max-width:100% !important;height:auto;} body {font-family:arial;} p,span,a {font-size:13.5pt !important;}'} />
								</View>
							</Content>
						</Container>
				);
		}
}

export default ArticleDetail;
