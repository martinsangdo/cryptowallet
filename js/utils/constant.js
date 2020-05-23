/**
 * author: Martin SD
 * constants
 */
import {setting} from './config.js';

export const C_Const = {
	RESPONSE_CODE: {
		SUCCESS: 200,
		FORBIDDEN: 403,
		BAD_REQUEST: 502,
		SERVER_ERROR: 500,
	},
	TEXT: {
		ERR_OFFLINE: 'Device is offline, app will be closed',
		ERR_NOT_LOGIN: 'User is not logined',
		ERR_EMPTY_NAME: 'Please input a name',
		ERR_INVALID_PASSWORD: 'Please input valid password (0-9a-zA-Z)',
		ERR_SHORT_PASS_LEN: 'Password must have 8 characters at least',
		ERR_EMPTY_CONFIRM_PASS: 'Please input valid confirm password',
		ERR_WRONG_CONFIRM_PASS: 'Confirm password is not match',
		ERR_EMPTY_EMAIL: 'Please input valid email',
		ERR_WRONG_EMAIL: 'Email is wrong format',
		ERR_EXISTED_EMAIL: 'This email is existed',
		ERR_NON_EXISTED_EMAIL: 'This email is not existed',
		ERR_SERVER: 'Please try it later',
		ERR_NET_REQUEST_FAIL: 'Network request failed',   //cannot connect to server
		ERR_LOGIN_FAILED: 'Your email or password is not correct',
		ERR_EMPTY_TO_ADDR: 'Please input correct receiver address',
		ERR_INVALID_AMOUNT: 'Please input correct amount',
		//message
		MESS_SIGNUP_OK: 'Registered successfully, please wait...',
		MESS_CREATE_WALLET_OK: 'Wallet is created successfully',
		MESS_SEND_COIN_OK: 'The amount is sent successfully',
		MESS_RESET_OK: 'An email will be sent to you within 24 hours'

	},
	COLLECTION_NAME: {		//in Firestore
		USER: 'user',
		ACCOUNT: 'account',	//account of coinbase
		ADDRESS: 'address',
		BOOKMARK: 'bookmark',
		FORGOT_PASS: 'forgot_pass'		//list of email need to reset pass
	},
	SALT_PASS: '6653bf66-82f6-4e2f-b341-4a8f49224575',	//to encrypt password
	COURSE_TYPE: 'event',
	AUTHORIZATION_PREFIX_HEADER: 'Bearer ', //used in header of Authorization
	ANDROID: 'ANDROID',
	IOS: 'IOS',
	SPLASH_TIMER: 1000,   //1s, time to display splash screen
	MAX_WAIT_RESPONSE: 30000, //30s, max time to wait response
	MAX_SPLASH_TIMER: 60000,   //60s, maximum time to display splash screen
	DATE_FORMAT: 'YYYY-MM-DD',   //birthday format
	NOTIFICATION_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
	COURSE_DATE_FORMAT: 'DD MMMM YYYY, dddd',
	PAGE_LEN: 20, //default item number in one page, should large enough to load more item
	EMPTY_DATETIME: '0000-00-00 00:00:00',
	EMPTY_DATE: '0000-00-00',
	//message keys get from server API
	RESPONSE_MESS_KEY: {
		LOGIN_SUCCESS: 'LOGIN_SUCCESS',
		SUCCESS: 'SUCCESS',
		NO_DATA: 'NO_DATA'
	},
	JSON_WEB_TOKEN: 'jwt',    //to verify request from this app
	//store/Preference keys
	STORE_KEY: {
		USER_INFO: 'USER_INFO',   //include: user_id, name, email
		FIREBASE_TOKEN: 'FIREBASE_TOKEN',
		USER_ID: 'user_id',
		EMAIL: 'email',
		COIN_LIST: 'COIN_LIST',
    LATEST_PRICE_DATA:'LATEST_PRICE_DATA',  //of coins
    LATEST_NEWS_DATA:'LATEST_NEWS_DATA',
    LATEST_PRICE_TIME:'LATEST_PRICE_TIME',  //last time get data from server
    LATEST_NEWS_TIME:'LATEST_NEWS_TIME',
    LATEST_NEWS_KEY_LIST:'LATEST_NEWS_KEY_LIST',
    BOOKMARKED_COINS: 'BOOKMARK_COINS'  //save bookmarked coins
	},
  LATEST_PRICE_CACHE_DURATION: 5*60*1000*1000,  //5 mins
  LATEST_NEWS_CACHE_DURATION: 60*60*1000*1000,  //1 hour
	ACTIVE_COLOR: '#008da9',
	ICON_URL: 'https://blockbod.com/public/blockbod/img/logo.jpeg',	//empty image in News
	TERM_URL: 'https://www.coinbase.com/about',
	PRIVACY_URL: 'https://www.coinbase.com/about'
};
