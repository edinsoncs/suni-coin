import { MESSAGE } from '../../../service/p2p.js';

export default (req, res, next) => {
	const { body: { recipient, amount }} = req;
	try{
		const tr = wallet_new.createTransaction(recipient, amount);
		p2pAction.broadcast(MESSAGE.TR, tr);
		res.json(tr);
	}catch(error){
		res.json({ 
			status: 0,
			error: error.message
		});
	}


};
