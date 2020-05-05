module.exports = (req, res, next) => {

	const { memoryPool: { transactions } }  = Blockchain;
	res.json(transactions);

}