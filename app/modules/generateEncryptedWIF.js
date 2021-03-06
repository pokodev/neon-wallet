// @flow
import { wallet } from '@cityofzion/neon-js'
import { validatePassphraseLength } from '../core/wallet'

// Constants
export const NEW_ENCRYPTED_WIF = 'NEW_ENCRYPTED_WIF'
export const RESET_ENCRYPTED_WIF = 'RESET_ENCRYPTED_WIF'

export const generateNewEncryptedWIF = (
  wif: string,
  passphrase: string,
  confirmPassphrase: string,
) => {
  if (passphrase !== confirmPassphrase) {
    throw new Error('Passphrases do not match')
  }
  if (!validatePassphraseLength(passphrase)) {
    throw new Error('Please choose a longer passphrase')
  }
  if (wif && !wallet.isWIF(wif)) {
    throw new Error('The private key is not valid')
  }

  const encryptedWIF = wallet.encrypt(wif, passphrase)
  return {
    type: NEW_ENCRYPTED_WIF,
    payload: { encryptedWIF },
  }
}

export function resetEncryptedWIF() {
  return {
    type: RESET_ENCRYPTED_WIF,
  }
}

// state getters
export const getEncryptedWIF = (state: Object) =>
  state.generateEncryptedWIF.encryptedWIF

const initialState = {
  encryptedWIF: null,
}

export default (state: Object = initialState, action: ReduxAction) => {
  switch (action.type) {
    case NEW_ENCRYPTED_WIF: {
      const { encryptedWIF } = action.payload
      return {
        ...state,

        encryptedWIF,
      }
    }
    case RESET_ENCRYPTED_WIF: {
      return { ...initialState }
    }
    default:
      return state
  }
}
