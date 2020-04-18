import mdDifficulty from './mdDifficulty';

describe('test mdDifficulty()', () =>{

	let block;

	beforeEach(() =>{
		block = {
			timestamp: Date.now(),
			difficulty: 3
		};
	});


	it('decremento (-)', () => {

		expect(mdDifficulty(block, block.timestamp + 60000)).toEqual(block.difficulty - 1);

	});

	it('incremento (+)', () =>{

		expect(mdDifficulty(block, block.timestamp + 1000)).toEqual(block.difficulty + 1);

	});


});