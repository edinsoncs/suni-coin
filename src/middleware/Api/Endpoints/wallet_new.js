import Wallet, { Transaction, blockchainWallet } from '../../../wallet/index.js';
import { INIT_BL } from '../../../wallet/wallet.js';
import context, { blockchain, wallets, walletMiner, CURRENT_WALLET_FILE } from '../../../service/context.js';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
        password: Joi.string().allow('', null)
});

export default (req, res) => {
        const { error, value } = schema.validate(req.body || {});
        if (error) {
                return res.status(400).json({ status: 0, error });
        }
        const { password } = value;

        const wallet = new Wallet(blockchain, 0);
        if(password){
                wallet.saveEncrypted(password);
        }

        // credit the new wallet on chain so balance persists
        const tx = Transaction.create(blockchainWallet, wallet.publicKey, INIT_BL);
        blockchain.setCurrentDelegate(walletMiner.publicKey);
        blockchain.addBlock([tx], walletMiner);

        context.currentWallet = wallet;
        wallets.push(wallet);
        try {
                const dir = path.dirname(CURRENT_WALLET_FILE);
                mkdirSync(dir, { recursive: true });
                writeFileSync(CURRENT_WALLET_FILE, JSON.stringify({ privateKey: wallet.exportPrivateKey() }));
        } catch {
                /* ignore persistence errors */
        }

        const data = {
                publicKey: wallet.publicKey,
                balance: blockchain.getBalance(wallet.publicKey)
        };

        res.json({
                status: 'ok',
                data
        });
};
