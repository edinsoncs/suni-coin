import { blockchain, walletMiner, p2pAction } from '../../../service/context.js';

export default (req, res) => {

        const { 'body': {data} } = req;
        const block = blockchain.addBlock(data, walletMiner);
        p2pAction.sync();
 	
 	res.json({
 		'blocks': blockchain.blocks.length,
 		block
 	});

};
