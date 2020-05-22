/**
 * author: Martin SD
 * API URI
 */
import {setting, Coinbase} from './config.js';

export const API_URI = {
		DEFAULT_REQUEST_HEADER: {   //header of request sending to server
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': 0,
				'Accept': 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
        'X-CMC_PRO_API_KEY': Coinbase.API_KEY,
				'CB-ACCESS-KEY': Coinbase.API_KEY,
				'CB-VERSION': '2018-06-02'		//get from https://www.coinbase.com/settings/api
		},
		MULTIPART_REQUEST_HEADER: {
				'Content-Type': 'multipart/form-data'
		},
		//Splash
		//Market
    GET_CURRENT_PRICE: 'https://scanner.tradingview.com/crypto/scan', //https://www.tradingview.com/widget/
		// GET_CURRENT_PRICE: setting.PRICE_IP + 'ticker/?limit=20',
		//News
		GET_NEWS_LIST: setting.NEWS_IP + 'posts?per_page=20',
		GET_MEDIA_LIST: 'media',
		//wallet
		GET_CURRENT_USER_INFO: '/v2/user',
		WALLET_ACCOUNTS: '/v2/accounts',

};
