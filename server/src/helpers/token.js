'use strict'

const { formatAscIIJSON } = require('./utils')
const Web3Util = require('./web3')
const BigNumber = require('bignumber.js')

let TokenHelper = {
    getTokenFuncs: async () => ({
        'decimals': '0x313ce567', // hex to decimal
        'symbol': '0x95d89b41', // hex to ascii
        'totalSupply': '0x18160ddd',
        'transfer': '0xa9059cbb',
        'name': '0x06fdde03'
    }),

    checkTokenType: async (code) => {
        let trc1Function = {
            'totalSupply': '0x18160ddd',
            'balanceOf': '0x70a08231',
            'allowance': '0xdd62ed3e',
            'transfer': '0xa9059cbb',
            'approve': '0x095ea7b3',
            'transferFrom': '0x23b872dd',
            'Transfer': '0xddf252ad',
            'Approval': '0x8c5be1e5',
            'name': '0x06fdde03',
            'symbol': '0x95d89b41',
            'decimals': '0x313ce567'
        }
        let trc3Function = {
            'Transfer': '0xddf252ad',
            'Approval': '0x8c5be1e5',
            'ApprovalForAll': '0x17307eab',
            'balanceOf': '0x70a08231',
            'ownerOf': '0x6352211e',
            'safeTransferFrom1': '0xb88d4fde',
            'safeTransferFrom': '0x42842e0e',
            'transferFrom': '0x23b872dd',
            'approve': '0x095ea7b3',
            // 'setApprovalForAll': '0xa22cb465',
            'getApproved': '0x081812fc',
            // 'isApprovedForAll': '0x7070ce33',
            'supportsInterface': '0x01ffc9a7',
            'totalSupply': '0x18160ddd'
        }
        let trc2Function = {
            'totalSupply': '0x18160ddd',
            'balanceOf': '0x70a08231',
            'estimateFee': '0x127e8e4d',
            'issuer': '0x1d143848',
            'allowance': '0xdd62ed3e',
            'transfer': '0xa9059cbb',
            'approve': '0x095ea7b3',
            'transferFrom': '0x23b872dd',
            'Transfer': '0xddf252ad',
            'Approval': '0x8c5be1e5',
            'Fee': '0xfcf5b327',
            'name': '0x06fdde03',
            'symbol': '0x95d89b41',
            'decimals': '0x313ce567',
            'minFee': '0x24ec7590'
        }

        let isTrc2 = true
        for (let trc2 in trc2Function) {
            let codeCheck = trc2Function[trc2]
            codeCheck = codeCheck.replace('0x', '')
            if (code.indexOf(codeCheck) < 0) {
                isTrc2 = false
                break
            }
        }
        if (isTrc2) {
            return 'trc2'
        }

        let isTrc1 = true
        for (let trc1 in trc1Function) {
            let codeCheck = trc1Function[trc1]
            codeCheck = codeCheck.replace('0x', '')
            if (code.indexOf(codeCheck) < 0) {
                isTrc1 = false
                break
            }
        }
        if (isTrc1) {
            return 'trc1'
        }

        let isTrc3 = true
        for (let trc3 in trc3Function) {
            let codeCheck = trc3Function[trc3]
            codeCheck = codeCheck.replace('0x', '')
            if (code.indexOf(codeCheck) < 0) {
                console.log(trc3Function[trc3])
                isTrc3 = false
                break
            }
        }
        if (isTrc3) {
            return 'trc3'
        }
        return 'other'
    },

    checkIsToken:async (code) => {
        let tokenFuncs = await TokenHelper.getTokenFuncs()
        for (let name in tokenFuncs) {
            let codeCheck = tokenFuncs[name]
            codeCheck = codeCheck.replace('0x', '')
            if (code.indexOf(codeCheck) >= 0) {
                return true
            }
        }

        return false
    },
    checkMintable: async (code) => {
        // mint(address,uint256)
        let mintFunction = '0x40c10f19'.replace('0x', '')
        if (code.indexOf(mintFunction) >= 0) {
            return true
        }
        return false
    },

    formatToken: async (item) => {
        item.name = await formatAscIIJSON(item.name)
        item.symbol = await formatAscIIJSON(item.symbol)

        return item
    },

    getTokenBalance: async (token, holder) => {
        let web3 = await Web3Util.getWeb3()
        // 0x70a08231 is mean balanceOf(address)
        let data = '0x70a08231' +
            '000000000000000000000000' +
            holder.substr(2) // chop off the 0x

        let result = await web3.eth.call({ to: token.hash, data: data })

        let quantity = new BigNumber(await web3.utils.hexToNumberString(result))
        let quantityNumber = quantity.dividedBy(10 ** token.decimals).toNumber()
        return { quantity: quantity.toString(10), quantityNumber: quantityNumber }
    }
}

module.exports = TokenHelper
