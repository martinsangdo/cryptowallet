import React, {Component} from "react";
import {View} from "react-native";

import {Container, Content, Text, Header, Title, Body, Left, Right, Icon} from "native-base";
import BaseScreen from "../../base/BaseScreen.js";

import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here

class Term extends BaseScreen {
	constructor(props) {
		super(props);
	}
	 //==========
		render() {
				return (
						<Container>
							<Header style={[common_styles.header, common_styles.whiteBg, {maxHeight:50}]}>
								<Left style={{flex:0.3, flexDirection: 'row', marginBottom:5}}>
									<TouchableOpacity onPress={() => this._go_back()} style={{width:40}}>
										<Icon name="ios-arrow-back-outline" style={styles.header_icon}/>
									</TouchableOpacity>
								</Left>
								<Body style={[styles.headerBody, {flex:0.8, marginBottom:5}]}>
									<Text>Terms</Text>
								</Body>
								<Right style={{flex:0.2, marginBottom:5}}>
								</Right>
							</Header>
							{/* END header */}

							<Content>
								
							</Content>
						</Container>
				);
		}
}

export default Term;
