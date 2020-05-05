import Wallet from '../../../wallet';


module.exports = (req, res, next) => {

	global.wallet_new = new Wallet(newBlockchain, 20);

	res.json({
		status: 'ok',
		data: wallet_new.blockchainWallet()
	});

}