import { blockchain, wallets } from '../../../service/context.js';

export default (req, res) => {
    const { address } = req.params;
    let balance;
    const wallet = wallets.find(w => w.publicKey === address);
    if(wallet){
        balance = wallet.calculateBalance('COIN');
    } else {
        balance = blockchain.getBalance(address);
    }
    res.json({ address, balance });
};
