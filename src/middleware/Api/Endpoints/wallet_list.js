export default (req, res) => {
    const wallets = global.wallets || [];
    res.json(wallets.map(w => w.blockchainWallet()));
};
