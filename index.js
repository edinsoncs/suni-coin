import Block from './src/blockchain/block';


//var result = (5 * 5)
//console.log(`Esto inicio ahora ${result}`);

const { genesis } = Block;
console.log(genesis.toString());


const bl = Block.mine(genesis, 'Soy un string');
console.log(bl.toString());
w
/*const bl_2 = Block.mine(genesis, 'xa010200');
console.log(bl_2.toString());*/

//const demo = Block.hash(Date.now(), 'sa0020102102xa', 'hola blockchain');
//console.log(`Hash 256: ${demo}`);

