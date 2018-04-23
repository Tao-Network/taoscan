import Tx from '../models/Tx'
import AccountRepository from './AccountRepository'
import Web3Util from '../helpers/web3'
import async from 'async'

let TxRepository = {
  getTxDetail: async (hash) => {
    if (!hash) {
      return false
    }
    let _tx = await Tx.findOne({hash: hash})

    let tx = null
    if (_tx && _tx.crawl) {
      tx = _tx
    }
    else {
      let web3 = await Web3Util.getWeb3()
      // Get tx detail using web3.
      _tx = _tx ? _tx : await web3.eth.getTransaction(hash)

      // Insert from account.
      if (_tx.from != null) {
        let from = await AccountRepository.updateAccount(_tx.from)
        _tx.from_id = from
      }

      // Insert to account.
      if (_tx.to != null) {
        let to = await AccountRepository.updateAccount(_tx.to)
        _tx.to_id = to
      }

      tx = await Tx.findOneAndUpdate({hash: _tx.hash}, _tx,
        {upsert: true, new: true})

      if (tx.to_id === null) {
        // Get smartcontract address if to is null.
        await TxRepository.getTxReceipt(hash)
      }
    }

    return tx
  },

  getTxReceipt: async (hash) => {
    if (!hash) {
      return false
    }
    // Check exist tx receipt.
    let tx = await Tx.findOne({hash: hash})
    if (!tx) {
      tx = TxRepository.getTxDetail(hash)
    }

    if (!tx.cumulativeGasUsed) {
      let web3 = await Web3Util.getWeb3()
      let receipt = await web3.eth.getTransactionReceipt(hash)

      // Update contract type.
      if (receipt, receipt.hasOwnProperty('contractAddress')) {
        tx.contractAddress = receipt.contractAddress
        let contract = await AccountRepository.updateAccount(
          receipt.contractAddress)
        if (contract) {
          contract.contractCreation = tx.from
          contract.save()
        }
      }

      tx.cumulativeGasUsed = receipt.cumulativeGasUsed
      tx.gasUsed = receipt.gasUsed
    }

    tx.crawl = true

    if (tx) {
      tx = await Tx.findOneAndUpdate({hash: tx.hash}, tx,
        {upsert: true, new: true})
    }

    return tx
  },

  updateBlockForTxs: async (block, hashes) => {
    return await Tx.update({hash: {$in: hashes}},
      {block_id: block, blockNumber: block.number, blockHash: block.hash},
      {multi: true})
  },
}

export default TxRepository