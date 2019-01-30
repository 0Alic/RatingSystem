/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

var web3 = require("web3");
var HDWalletProvider = require("truffle-hdwallet-provider");
var fs = require("fs");

const credentials = JSON.parse(fs.readFileSync('ropsten.json', 'utf8'));

var mnemonic = credentials["mnemonic"];
var infura_key = credentials["infuraKey"];
var cnr = credentials["cnr"];

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },

    //Info for deployment on Ropsten, exploiting an Infura node
    ropsten:  {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/"+infura_key, 2)
      },
      network_id: 3,
      host: "127.0.0.1",
      port:  8545,
      gas:   4700000,
      gasPrice: 30000000000,
    },
    
    // CNR testnet
    testnetCNR: {
      provider: function() {
        return new web3.providers.HttpProvider("http://"+cnr+":8545")
      },
      network_id: "*",  // <== va bene "*"?
      host: "localhost", // <== ok?
      port:  8545, 
      gas:   4700000,
      gasPrice: 30000000000,
    }
  },    

  solc: {
    version: "^0.5.3",
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
