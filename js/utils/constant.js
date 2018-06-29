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
		ERR_NOT_LOGIN: 'User is not logined',
		ERR_EMPTY_NAME: 'Please input a name',
		ERR_INVALID_PASSWORD: 'Please input valid password (0-9a-zA-Z)',
		ERR_SHORT_PASS_LEN: 'Password must have 8 characters at least',
		ERR_EMPTY_CONFIRM_PASS: 'Please input valid confirm password',
		ERR_WRONG_CONFIRM_PASS: 'Confirm password is not match',
		ERR_EMPTY_EMAIL: 'Please input valid email',
		ERR_WRONG_EMAIL: 'Email is wrong format',
		ERR_EXISTED_EMAIL: 'This email is existed',
		ERR_SERVER: 'Please try it later',
		ERR_NET_REQUEST_FAIL: 'Network request failed',   //cannot connect to server
		//message
		MESS_SIGNUP_OK: 'Registered successfully, please wait...',
		MESS_CREATE_WALLET_OK: 'Wallet is created successfully'
	},
	COLLECTION_NAME: {
		USER: 'user',
		ACCOUNT: 'account',
		ADDRESS: 'address'
	},
	SALT_PASS: '6653bf66-82f6-4e2f-b341-4a8f49224575',	//to encrypt password
	ARTICLE_TYPE: 'blog',
	COURSE_TYPE: 'event',
	EN_LANG_KEY: 'en',    //english
	VI_LANG_KEY: 'vn',    //Vietnamese
	CN_LANG_KEY: 'cn',    //chinese
	THAI_LANG_KEY: 'th',  //thailand
	AUTHORIZATION_PREFIX_HEADER: 'Bearer ', //used in header of Authorization
	ANDROID: 'ANDROID',
	IOS: 'IOS',
	SPLASH_TIMER: 1000,   //time to display splash screen
	MAX_SPLASH_TIMER: 60000,   //maximum time to display splash screen
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
	LOGIN_TYPE: {   //login by normal acccount or social accounts
		GOOGLE: 'google',
		FACEBOOK: 'facebook',
		NORMAL: 'normal'
	},
	JSON_WEB_TOKEN: 'jwt',    //to verify request from this app
	//store/Preference keys
	STORE_KEY: {
		USER_INFO: 'USER_INFO',   //include: user_id, name, email
		FIREBASE_TOKEN: 'FIREBASE_TOKEN',
		USER_ID: 'user_id',
		EMAIL: 'email'
	},
	ACTIVE_COLOR: '#008da9',
	ICON_URL: 'https://blockbod.com/public/blockbod/img/logo.jpeg'
};
