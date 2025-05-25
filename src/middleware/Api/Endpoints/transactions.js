module.exports = (req, res, next) => {

        const { memoryPool: { transactions } }  = newBlockchain;
	res.json(transactions);

}