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
  item_row: {flex:1, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'space-between'},
  picker_parent: {minWidth:200, backgroundColor: '#fff'},
  picker_language: {
    width: deviceWidth, alignSelf: 'center',
    borderColor: '#fff',
    borderWidth: 1, alignItems: 'center',
    backgroundColor: '#fff'
  },
  picker_arrow: {position: 'absolute', right:20, top: 12},
	webview: {
		flex:1, width:'100%', minWidth:deviceWidth,
		minHeight:deviceHeight-80, //why 80???
		height:'100%'
	}
};
