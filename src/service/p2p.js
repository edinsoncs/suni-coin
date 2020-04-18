import WebSocket from 'ws';

const { P2P_PORT = 6000, PORTS} = process.env;
const ports = (PORTS) ? PORTS.split(',') : [];
const MESSAGE = { 
	BLOCKS: 'blocks',
	TR: 'transaction' ,
	WIPE: 'wipe_memorypool'
};


class P2PAction{

	constructor(blockchain){
		this.blockchain = blockchain;
		this.sockets = [];
	}

	listen(){
		const server = new WebSocket.Server({port: P2P_PORT});
		server.on('connection', (socket) => this.Connection(socket));

		ports.forEach((port) => {
			const socket = new WebSocket(port);
			socket.on('open', () => this.Connection(socket));
		});

		console.log(`ws:port => ${P2P_PORT}`);
	}

	Connection(socket){
		const { blockchain } = this;
		this.sockets.push(socket);
		
		console.log('Socket conectado');
		
		socket.on('message', (message) =>{
			const { type, value} = JSON.parse(message);
			
			try{
				if(type === MESSAGE.BLOCKS) blockchain.replace(value);
				else if(type === MESSAGE.TR) blockchain.memoryPool.addOrUpdate(value);
				else if(type === MESSAGE.WIPE) blockchain.memoryPool.wipe();

			} catch(err){
				console.log(`ws_error ${err}`);
				throw Error(err);
			}

		});

		socket.send(JSON.stringify({type: MESSAGE.BLOCKS,value: blockchain.blocks}));
	}

	sync() {
		const { blockchain : {blocks} } = this;
		this.broadcast(MESSAGE.BLOCKS, blocks);
	}

	broadcast(type, value){
		console.log(`broadcast ${type}...`, value);
		const message = JSON.stringify({type,value});
		this.sockets.forEach((socket) => socket.send(message));
	}


}

export { MESSAGE };

export default P2PAction
