import { HDNodeWallet } from "ethers"
import { Wallet } from "ethers"
import { create } from "zustand"

type WalletStore = {
    wallet: Wallet | HDNodeWallet | null
    setWallet: (wallet: Wallet | HDNodeWallet) => void
    expiredTime: number | null
    setExpiredTime: (expiredTime: number) => void
}

const useWallet = create<WalletStore>((set) => ({
    wallet: null,
    setWallet: (wallet: Wallet | HDNodeWallet) => set({ wallet }),
    expiredTime: null,
    setExpiredTime: (expiredTime: number) => {
        set({ expiredTime })
        setTimeout(() => {
            set({ expiredTime: null })
        }, expiredTime - Date.now())
    },
}))

export default useWallet

