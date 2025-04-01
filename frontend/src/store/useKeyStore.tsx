import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type KeystoreStore = {
    keystore: string
    setKeystore: (keystore: string) => void
}

const useKeystore = create<KeystoreStore>()(
    persist(
        (set) => ({
            keystore: "",
            setKeystore: (keystore: string) => set({ keystore }),
        }),
        {
            name: 'keystore',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)
export default useKeystore






