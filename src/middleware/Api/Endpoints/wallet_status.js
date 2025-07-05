import { currentWallet } from '../../../service/context.js';

export default (req, res) => {
  if (!currentWallet) {
    return res.json({ status: 'ok', active: false });
  }
  res.json({
    status: 'ok',
    active: true,
    data: currentWallet.blockchainWallet()
  });
};
