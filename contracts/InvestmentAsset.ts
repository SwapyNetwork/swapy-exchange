export const InvestmentAssetInterface = {
  "contract_name": "InvestmentAsset",
  "abi": [
    {
      "constant": true,
      "inputs": [],
      "name": "investor",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "status",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "protocolVersion",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "offerAddress",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "value",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_id",
          "type": "string"
        },
        {
          "name": "_investor",
          "type": "address"
        },
        {
          "name": "_agreementTermsHash",
          "type": "bytes"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "agreeInvestment",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "agreementTermsHash",
      "outputs": [
        {
          "name": "",
          "type": "bytes"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_id",
          "type": "string"
        },
        {
          "name": "_agreementTermsHash",
          "type": "bytes"
        }
      ],
      "name": "transferFunds",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": true,
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_protocolVersion",
          "type": "string"
        },
        {
          "name": "_offerAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_id",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_from",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "Transferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_id",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_investor",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_terms",
          "type": "bytes"
        }
      ],
      "name": "Agreements",
      "type": "event"
    }
  ],
  "unlinked_binary": "0x6060604052341561000f57600080fd5b604051610bc6380380610bc683398101604052808051919060200180518201919060200180519150505b60018054600160a060020a031916600160a060020a038516179055600482805161006792916020019061009d565b5060008054600160a060020a031916600160a060020a0383161781556006805460ff19166001835b02179055505b50505061013d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100de57805160ff191683800117855561010b565b8280016001018555821561010b579182015b8281111561010b5782518255916020019190600101906100f0565b5b5061011892915061011c565b5090565b61013a91905b808211156101185760008155600101610122565b5090565b90565b610a7a8061014c6000396000f300606060405236156100965763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416631e0018d6811461009b578063200d2ed2146100ca5780632ae9c600146101015780633ea42de31461018c5780633fa4f245146101bb57806345eab057146101e05780637ef428f61461029b5780638da5cb5b14610326578063f7a2a06314610355575b600080fd5b34156100a657600080fd5b6100ae6103f1565b604051600160a060020a03909116815260200160405180910390f35b34156100d557600080fd5b6100dd610400565b604051808260028111156100ed57fe5b60ff16815260200191505060405180910390f35b341561010c57600080fd5b610114610409565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101515780820151818401525b602001610138565b50505050905090810190601f16801561017e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561019757600080fd5b6100ae6104a7565b604051600160a060020a03909116815260200160405180910390f35b34156101c657600080fd5b6101ce6104b6565b60405190815260200160405180910390f35b34156101eb57600080fd5b61028760046024813581810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843782019150505050505091908035600160a060020a031690602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284375094965050933593506104bc92505050565b604051901515815260200160405180910390f35b34156102a657600080fd5b6101146106af565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101515780820151818401525b602001610138565b50505050905090810190601f16801561017e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561033157600080fd5b6100ae61074d565b604051600160a060020a03909116815260200160405180910390f35b61028760046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284375094965061075c95505050505050565b604051901515815260200160405180910390f35b600254600160a060020a031681565b60065460ff1681565b60048054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561049f5780601f106104745761010080835404028352916020019161049f565b820191906000526020600020905b81548152906001019060200180831161048257829003601f168201915b505050505081565b600054600160a060020a031681565b60035481565b60015460009033600160a060020a039081169116146104da57600080fd5b6000805b60065460ff1660028111156104ef57fe5b146104f957600080fd5b6002805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03871617905560058480516105349291602001906109ae565b506003839055600680546001919060ff191682805b02179055506001546002546003547f85d0ba74569c6368f1bf56ceefba234a58367bd88e5a04eb4c8f2bc763aabe18928992600160a060020a03918216929116906005604051600160a060020a038086166020830152841660408201526060810183905260a080825281906080820190820188818151815260200191508051906020019080838360005b838110156105ec5780820151818401525b6020016105d3565b50505050905090810190601f1680156106195780820380516001836020036101000a031916815260200191505b5083810382528454600260001961010060018416150201909116048082526020909101908590801561068c5780601f106106615761010080835404028352916020019161068c565b820191906000526020600020905b81548152906001019060200180831161066f57829003601f168201915b505097505050505050505060405180910390a1600191505b5b505b949350505050565b60058054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561049f5780601f106104745761010080835404028352916020019161049f565b820191906000526020600020905b81548152906001019060200180831161048257829003601f168201915b505050505081565b600154600160a060020a031681565b60025460009033600160a060020a0390811691161461077a57600080fd5b6001805b60065460ff16600281111561078f57fe5b1461079957600080fd5b60035434158015906107aa57508034145b15156107b557600080fd5b836040518082805190602001908083835b602083106107e657805182525b601f1990920191602091820191016107c6565b6001836020036101000a0380198251168184511617909252505050919091019250604091505051908190039020600560405180828054600181600116156101000203166002900480156108705780601f1061084e576101008083540402835291820191610870565b820191906000526020600020905b81548152906001019060200180831161085c575b505091505060405190819003902014156109a257600154600160a060020a03163480156108fc0290604051600060405180830381858888f1935050505015156108b857600080fd5b600680546002919060ff19166001835b02179055506002546001547f301ee4bd595d57178c127d6e8f8b5a93257fa30fc20d16f46a1c21b1d1ff901b918791600160a060020a03918216911634604051600160a060020a038085166020830152831660408201526060810182905260808082528190810186818151815260200191508051906020019080838360005b838110156109605780820151818401525b602001610947565b50505050905090810190601f16801561098d5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a1600192505b5b5b505b505b92915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106109ef57805160ff1916838001178555610a1c565b82800160010185558215610a1c579182015b82811115610a1c578251825591602001919060010190610a01565b5b50610a29929150610a2d565b5090565b610a4b91905b80821115610a295760008155600101610a33565b5090565b905600a165627a7a72305820aafdc89d15b3959b6d7ddbc9460bef72adb3fea2abf1022b6c0e6e5f4f297bff0029",
  "networks": {
    "3": {
      "links": {},
      "events": {
        "0xd1ba4ac2e2a11b5101f6cb4d978f514a155b421e8ec396d2d9abaf0bb02917ee": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "from",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transferred",
          "type": "event"
        },
        "0xdd7f7a6205119575e0831d8e96e9762422e0c00eea6120e4944cf6bf04332fa9": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "investor",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "terms",
              "type": "bytes"
            }
          ],
          "name": "Agreements",
          "type": "event"
        },
        "0x301ee4bd595d57178c127d6e8f8b5a93257fa30fc20d16f46a1c21b1d1ff901b": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_id",
              "type": "string"
            },
            {
              "indexed": false,
              "name": "_from",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_to",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "Transferred",
          "type": "event"
        },
        "0x85d0ba74569c6368f1bf56ceefba234a58367bd88e5a04eb4c8f2bc763aabe18": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_id",
              "type": "string"
            },
            {
              "indexed": false,
              "name": "_owner",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_investor",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_value",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_terms",
              "type": "bytes"
            }
          ],
          "name": "Agreements",
          "type": "event"
        }
      },
      "updated_at": 1508275578782
    },
    "4": {
      "links": {},
      "events": {
        "0x301ee4bd595d57178c127d6e8f8b5a93257fa30fc20d16f46a1c21b1d1ff901b": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_id",
              "type": "string"
            },
            {
              "indexed": false,
              "name": "_from",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_to",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "Transferred",
          "type": "event"
        },
        "0x85d0ba74569c6368f1bf56ceefba234a58367bd88e5a04eb4c8f2bc763aabe18": {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_id",
              "type": "string"
            },
            {
              "indexed": false,
              "name": "_owner",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_investor",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_value",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "_terms",
              "type": "bytes"
            }
          ],
          "name": "Agreements",
          "type": "event"
        }
      },
      "updated_at": 1508271340972
    }
  },
  "schema_version": "0.0.5",
  "updated_at": 1508275578782
};
