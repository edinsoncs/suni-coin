export default (req, res, next) => {
	var blockchain = newBlockchain;
	res.json(blockchain.blocks);
};
