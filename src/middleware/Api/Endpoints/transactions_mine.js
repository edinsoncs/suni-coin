import { miner } from '../../../service/context.js';

export default (req, res) => {

	try{
                miner.mine();
		res.redirect('/api/blocks');
	}catch(error){
		res.json({error: error.message});
	}

};
