/**
 * author: Martin SD
 * configuration
 */

export const setting = {
  WALLET_IP: 'https://api.coinbase.com',    //API IP
  PRICE_IP: 'http://api.coinmarketcap.com/v2/',
  NEWS_IP: 'http://news.bitcoin.com/wp-json/wp/v2/'
};

export const Coinbase = {
  API_KEY: '0zGLoccZQkdc8ViE',
  SECRET_KEY: 'xOzMvwhjmhVxq9UAdhCnMq29vUsf8FvC',
  COIN_LIST: [
    {
      id: 'd0ca887e-21dc-5425-b37e-c5505c22cbee',
      name: 'Bitcoin (BTC)',
      code: 'BTC'
    },
    {
      id: '91735a18-d8ef-5c40-bb4f-8ce64acf8bba',
      name: 'Ethereum (ETH)',
      code: 'ETH'
    },
    {
      id: '6e2970bc-190e-5c95-92aa-3ddc1eaee43c',
      name: 'Bitcoin Cash (BCH)',
      code: 'BCH'
    },
    {
      id: '1b9e9fde-7e97-5f8e-8454-a57fdbf0a28e',
      name: 'Litecoin (LTC)',
      code: 'LTC'
    }
  ]
};
