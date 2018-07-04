import React, {Component} from "react";
import {View, TouchableOpacity} from "react-native";

import {Container, Content, Text, Header, Title, Body, Left, Right, Icon, Item, Tabs, Tab} from "native-base";
import {NavigationActions} from "react-navigation";

import BaseScreen from "../../base/BaseScreen.js";
import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here

import TabAbout from "./about";
import TabInsurance from "./insurance";

class Setting extends BaseScreen {
    constructor(props) {
  		super(props);
  		this.state = {
  			loading_indicator_state: false
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
                  <Text uppercase={false} style={[common_styles.bold, common_styles.default_font_color]}>Information</Text>
                </Body>
                <Right style={[common_styles.headerRight, {flex:0.15}]}></Right>
              </Header>

              <Content>
                <Tabs>
                  <Tab heading="About">
                    <TabAbout />
                  </Tab>
                  <Tab heading="Insurance">
                    <TabInsurance />
                  </Tab>
                </Tabs>
              </Content>
            </Container>
        );
    }
}

export default Setting;
