import Wallet from '../../../wallet/index.js';


export default (req, res, next) => {

	global.wallet_new = new Wallet(newBlockchain, 20);

	res.json({
		status: 'ok',
		data: wallet_new.blockchainWallet()
	});

};
