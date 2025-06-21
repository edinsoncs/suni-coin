import Elliptic from 'elliptic';
import gnHash from './hash.js';

const ec = new Elliptic.ec('secp256k1');

export default {

        createKeyPair: () => ec.genKeyPair(),
        fromPrivate: (privKey) => ec.keyFromPrivate(privKey),
        verifySignature: (publicKey, signature, data) => {
                return ec.keyFromPublic(publicKey, 'hex').
                verify(gnHash(data), signature);
        }

}