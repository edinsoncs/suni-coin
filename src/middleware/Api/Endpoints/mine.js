export default (req, res, next) => {

	var blockchain = newBlockchain;

        const { 'body': {data} } = req;
        const block = blockchain.addBlock(data, newWalletMiner.publicKey);
	p2pAction.sync();
 	
 	res.json({
 		'blocks': blockchain.blocks.length,
 		block
 	});

};
