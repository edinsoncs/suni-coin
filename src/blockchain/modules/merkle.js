import { gnHash } from '../../modules/index.js';

function hashLeaf(data){
    return gnHash(JSON.stringify(data));
}

export function getMerkleRoot(leaves){
    if(!Array.isArray(leaves) || leaves.length === 0){
        return gnHash('');
    }
    let level = leaves.map(hashLeaf);
    while(level.length > 1){
        if(level.length % 2 === 1){
            level.push(level[level.length - 1]);
        }
        const next = [];
        for(let i=0;i<level.length;i+=2){
            next.push(gnHash(level[i] + level[i+1]));
        }
        level = next;
    }
    return level[0];
}

export function getMerkleProof(leaves, index){
    if(!Array.isArray(leaves) || index < 0 || index >= leaves.length){
        return [];
    }
    const hashes = leaves.map(hashLeaf);
    let idx = index;
    const proof = [];
    let level = hashes;
    while(level.length > 1){
        if(level.length % 2 === 1){
            level.push(level[level.length - 1]);
        }
        const pairIndex = idx % 2 === 0 ? idx + 1 : idx - 1;
        proof.push(level[pairIndex]);
        const next = [];
        for(let i=0;i<level.length;i+=2){
            next.push(gnHash(level[i] + level[i+1]));
        }
        idx = Math.floor(idx / 2);
        level = next;
    }
    return proof;
}

export function verifyProof(leaf, proof, root, index){
    let hash = hashLeaf(leaf);
    let idx = index;
    for(const sibling of proof){
        if(idx % 2 === 0){
            hash = gnHash(hash + sibling);
        } else {
            hash = gnHash(sibling + hash);
        }
        idx = Math.floor(idx / 2);
    }
    return hash === root;
}

export default { getMerkleRoot, getMerkleProof, verifyProof };
