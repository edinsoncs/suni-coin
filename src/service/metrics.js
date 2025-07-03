import WebSocket from 'ws';

class Metrics {
  constructor(blockchain, p2pAction) {
    this.blockchain = blockchain;
    this.p2pAction = p2pAction;
    this.wss = null;
    this.lastTimestamp = blockchain.getLatestBlock().timestamp;
  }

  gather() {
    const mempoolSize = this.blockchain.memoryPool.transactions.length;
    const connectedNodes = this.p2pAction.sockets.length;
    let blockTime = 0;
    const latest = this.blockchain.getLatestBlock();
    if (latest) {
      blockTime = latest.timestamp - this.lastTimestamp;
      if (blockTime !== 0) {
        this.lastTimestamp = latest.timestamp;
      }
    }
    return { blockTime, mempoolSize, connectedNodes };
  }

  listen(server) {
    this.wss = new WebSocket.Server({ server, path: '/api/metrics/live' });
    this.wss.on('connection', (ws) => {
      const send = () => {
        const data = this.gather();
        ws.send(JSON.stringify(data));
      };
      send();
      const id = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) send();
      }, 1000);
      ws.on('close', () => clearInterval(id));
    });
  }
}

export default Metrics;
