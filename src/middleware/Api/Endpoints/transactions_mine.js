module.exports = (req, res, next) => {

	try{
		newMiner.mine();
		res.redirect('/api/blocks');
	}catch(error){
		res.json({error: error.message});
	}

}