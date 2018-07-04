import React, { Component } from "react";
import { Content, Text, Body } from "native-base";
import common_styles from "../../../css/common";

export default class TabAbout extends Component {
  render() {
    return (
      <Content padder>
        <Text style={common_styles.margin_t_10}>Founded in April of 2018, CryptoWallet is a digital currency wallet and platform where merchants and consumers can transact with new digital currencies like bitcoin, ethereum, and litecoin.</Text>
				<Text style={common_styles.margin_t_10}>Bitcoin is the world&#8217;s most widely used alternative currency with a total market cap of over $100 billion. The bitcoin network is made up of thousands of computers run by individuals all over the world.</Text>
      </Content>
    );
  }
}
