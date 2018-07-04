import React, { Component } from "react";
import {View} from "react-native";
import { Content, Text, Body } from "native-base";
import common_styles from "../../../css/common";

export default class TabInsurance extends Component {
  render() {
    return (
      <View style={{flex:1, margin: 10}}>
        <Text style={common_styles.margin_t_10}>CryptoWallet secures customer digital currency through a combination of secure, online servers and offline ("cold") storage. CryptoWallet maintains 98% or more of customer digital currency in cold storage, with the remainder in secure online servers as necessary to serve the liquidity needs of our customers.</Text>
        <Text style={common_styles.margin_t_10}>CryptoWallet maintains commercial criminal insurance in an aggregate amount that is greater than the value of digital currency we maintain in online storage. Our insurance policy is made available through a combination of third-party insurance underwriters and CryptoWallet, who is a co-insurer under the policy.</Text>
        <Text style={common_styles.margin_t_10}>The policy insures against theft of digital currency that results from a security breach or hack, employee theft, or fraudulent transfer.</Text>
        <Text style={common_styles.margin_t_10}>Our policy does not cover any losses resulting from unauthorized access to your personal CryptoWallet. It is your responsibility to use a strong password and maintain control of all login credentials you use to access CryptoWallet. Digital currency is not legal tender and is not backed by the government. Digital currency, such as Bitcoin, Litecoin, and Ethereum, is not subject to Federal Deposit Insurance Corporation ("FDIC") or Securities Investor Protection Corporation protections.</Text>
      </View>
    );
  }
}
