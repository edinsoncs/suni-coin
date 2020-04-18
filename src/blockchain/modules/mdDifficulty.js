const MINE_TIME = 3000;
export default (previousBlock, timestamp) =>{

	const { difficulty } = previousBlock;

	return previousBlock.timestamp + MINE_TIME > timestamp
	? difficulty + 1
	: difficulty - 1;

}