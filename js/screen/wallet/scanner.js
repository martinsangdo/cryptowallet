import React, {Component} from "react";
import {Image, View, Platform, TouchableOpacity, Dimensions} from "react-native";

import {Container, Content, Button, Text, Header, Title, Body, Left, Right, Icon} from "native-base";
import BaseScreen from "../../base/BaseScreen.js";
import {API_URI} from '../../utils/api_uri';

import common_styles from "../../../css/common";
import styles from "./style";    //CSS defined here
import Utils from "../../utils/functions";
import store from 'react-native-simple-store';
import CameraScanner from 'react-native-camera';

const {windowW, windowH} = Dimensions.get('window');

class Scanner extends BaseScreen {
	constructor(props) {
		super(props);
	}
		componentWillMount() {
		}
		//
		_detected_code = (code) => {
      // Utils.xlog('scanned code', code);
			//goback with scanned code
			this.props.navigation.state.params.onScanned(code);
			this.props.navigation.goBack();
		};
		//
		_go_back = () => {
			this.props.navigation.goBack();
		};
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
									<Text>Scan receiver address</Text>
								</Body>
								<Right style={{flex:0.2, marginBottom:5}}>
								</Right>
							</Header>
							{/* END header */}

							<Content>
								<View style={{marginTop:20}} />
								<View style={[styles.camera_container, {height: windowW>windowH?windowH:windowW}]}>
									<CameraScanner
										style={styles.preview}
										onBarCodeRead={(e) => this._detected_code(e.data)}
										ref={cam => this.camera = cam}
										aspect={CameraScanner.constants.Aspect.fill}
										>
									</CameraScanner>
								</View>
							</Content>
						</Container>
				);
		}
}

export default Scanner;
