import { Router } from 'express'

import AccountController from './AccountController'
import TxController from './TxController'
import CronController from './CronController'
import BlockController from './BlockController'
import TokenController from './TokenController'
import TokenTxController from './TokenTxController'
import TokenHolderController from './TokenHolderController'
import AuthController from './AuthController'

const router = Router()

// Add USERS Routes
router.use(AuthController)
router.use(BlockController)
router.use(CronController)
router.use(AccountController)
router.use(TxController)
router.use(TokenController)
router.use(TokenTxController)
router.use(TokenHolderController)

export default router
