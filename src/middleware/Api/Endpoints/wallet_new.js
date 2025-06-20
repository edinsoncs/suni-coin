import Wallet from '../../../wallet/index.js';


export default (req, res) => {
        const { password } = req.body || {};
        const wallet = new Wallet(newBlockchain, 20);
        wallet.password = password;
        global.wallet_new = wallet;

        res.json({
                status: 'ok',
                data: wallet.blockchainWallet()
        });
};
