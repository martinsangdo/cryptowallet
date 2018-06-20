import React, {Component} from "react";
import {View, TouchableOpacity, Linking, BackHandler} from "react-native";

import {Container, Content, Text, Header, Title, Body, Left, Right, Icon, Picker, Item} from "native-base";
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

const PickerItem = Picker.Item;

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
   //==========
    render() {
        return (
            <Container padder>
              <Header style={[common_styles.header, common_styles.whiteBg]}>
                <Left style={styles.left}>
                </Left>
                <Body style={styles.headerBody}>
                  <Text uppercase={false} style={[common_styles.bold, common_styles.margin_l_10]}>Settings</Text>
                </Body>
                <Right style={styles.right}></Right>
              </Header>

              <Content>
                <Spinner visible={this.state.loading_indicator_state} textStyle={common_styles.whiteColor} />

              </Content>
            </Container>
        );
    }
}

export default Setting;
