import { currentWallet } from '../../../service/context.js';

export default (req, res) => {

        const my_wallet = currentWallet.sign(req.body.private);

        console.log(my_wallet);

        res.json({
                status: 'ok',
                data: {
                        publicKey: currentWallet.publicKey,
                        balance: currentWallet.balance
                }
        });


};
