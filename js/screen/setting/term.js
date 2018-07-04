import React, { Component } from "react";
import {View, WebView} from "react-native";
import { Content, Text, Body } from "native-base";

import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Spinner from 'react-native-loading-spinner-overlay';
import {C_Const} from '../../utils/constant';

export default class TabTerm extends Component {
  constructor(props) {
		super(props);
		this.state = {
			loading_indicator_state: false
		};
	}
  //close spinner after page loading
	_close_spinner = () => {
		this.setState({
			loading_indicator_state: false
		});
	};
	//
	_start_spinner = () => {
		setTimeout( () => {
			this.setState({
				loading_indicator_state: true
			});
		}, 1000);
	};
	//
	_onNavigationStateChange = (event) => {

	};
  //============
  render() {
    return (
      <Content padder>

        <WebView
            ref={'WEBVIEW_REF'}
            source={{uri: C_Const.TERM_URL}}
            style={styles.webview}
            onLoadEnd={this._close_spinner}
            onLoadStart={this._start_spinner}
            onNavigationStateChange={this._onNavigationStateChange}
          />
      </Content>
    );
  }
}
