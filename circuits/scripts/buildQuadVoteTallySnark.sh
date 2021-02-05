#!/bin/bash

set -e

cd "$(dirname "$0")"
cd ..
mkdir -p params

NODE_OPTIONS=--max-old-space-size=8192 node build/buildSnarks.js -i circom/test/quadVoteTally_test.circom -j params/qvtCircuit.r1cs -w params/qvt.wasm -y params/qvt.sym -p params/qvtPk.bin -v params/qvtVk.json -s params/QuadVoteTallyVerifier.sol -vs QuadVoteTallyVerifier -pr params/qvt.params

echo 'Copying QuadVoteTallyVerifier.sol to contracts/sol.'
cp ./params/QuadVoteTallyVerifier.sol ../contracts/sol/
