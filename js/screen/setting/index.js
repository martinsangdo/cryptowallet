import React, {Component} from "react";
import {View, TouchableOpacity} from "react-native";

import {Container, Content, Text, Header, Title, Body, Left, Right, Icon, Item} from "native-base";
import {NavigationActions} from "react-navigation";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import {C_Const, C_MULTI_LANG} from '../../utils/constant';
import store from 'react-native-simple-store';
import {API_URI} from '../../utils/api_uri';
import Spinner from 'react-native-loading-spinner-overlay';
import RequestData from '../../utils/https/RequestData';

class Setting extends BaseScreen {
    constructor(props) {
  		super(props);
  		this.state = {
  			loading_indicator_state: false,
        jwt: '',
  		};
  	}
    //
    componentDidMount() {
    }
    //
    _sign_out = () => {
      
    };
   //==========
    render() {
        return (
            <Container padder>
              <Header style={[common_styles.header, common_styles.whiteBg]}>
                <Left style={[common_styles.headerLeft, {flex:0.15}]}>
                </Left>
                <Body style={styles.headerBody}>
                  <Text uppercase={false} style={[common_styles.bold, common_styles.default_font_color]}>Settings</Text>
                </Body>
                <Right style={[common_styles.headerRight, {flex:0.15}]}></Right>
              </Header>

              <Content>
                <Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />
                <TouchableOpacity onPress={() => this._sign_out()}>
                  <Text>Log out</Text>
                </TouchableOpacity>
              </Content>
            </Container>
        );
    }
}

export default Setting;
