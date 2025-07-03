import { wallets } from '../../../service/context.js';
import Joi from '../../../utils/validator.js';

const schema = Joi.object({
  address: Joi.string().hex().required()
});

export default (req, res) => {
  const { error, value } = schema.validate(req.body || {});
  if (error) {
    return res.status(400).json({ status: 0, error });
  }
  const { address } = value;
  const wallet = wallets.find((w) => w.publicKey === address);
  if (!wallet) {
    return res.json({ status: 0, error: 'Wallet not found' });
  }
  res.json({
    status: 'ok',
    publicKey: wallet.publicKey,
    privateKey: wallet.exportPrivateKey ? wallet.exportPrivateKey() : wallet.keyPair.getPrivate('hex')
  });
};
