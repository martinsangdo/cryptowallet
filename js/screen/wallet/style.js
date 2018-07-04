/**
 * author: Martin SD
 */
const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default {
	headerBody: {
		flex: 0.7, justifyContent: "center", flexDirection: "row", alignItems: 'center'
	},
	left_row: {flex:1, flexDirection: 'row'},
	search_bar: {
		width: deviceWidth - 120, height: Platform.OS==='ios'?35:40, backgroundColor: '#eee',
		justifyContent: 'center', marginTop: 2, borderRadius:6, borderColor:'#eee'
	},
	search_cancel: {width:100, justifyContent: 'center'},
	list_item: {marginBottom:20},
	btn_row: {flex:1, flexDirection: 'row', justifyContent: 'space-between', marginLeft:20, marginRight:20},
	thumb: {width: deviceWidth, height: 185},
	btn_active: {backgroundColor: '#008da9'},
	home_avatar: {
    width:100,height:100,marginBottom:10, borderRadius: 6
  },
	a_href: {color:'#00f', fontWeight: 'bold'},
	wallet_item: {padding:20, borderTopWidth:1, borderTopColor: '#ddd'},
	coin_name: {fontSize:20, fontWeight: 'bold', width:'40%'},
	td_item: {fontSize:20,width:'30%'},
	icon_send: {width:'20%'},
	icon_qr: {width:'10%'},
	icon: {fontSize:20},
	addr_str: {fontSize:12},
	camera_container: {
    justifyContent: 'center',
    alignItems: 'center',
		width: deviceWidth,
    height: deviceHeight - 100
  },
  preview: {
    width: 300,
    height: 200
  }
};
