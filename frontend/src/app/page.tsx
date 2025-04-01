'use client'
import useKeyStore from "@/store/useKeyStore";
import useWallet from "@/store/useWallet";
import { useRouter } from 'next/navigation'
import Wallet from "@/components/Wallet";
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter()
  const { keystore } = useKeyStore()
  const { wallet, expiredTime } = useWallet()

  useEffect(() => {
    if (wallet && expiredTime && expiredTime < Date.now()) {
      router.push('/login')
    }
  }, [wallet, expiredTime, router])

  useEffect(() => {
    if (!keystore) {
      router.push('/register')
    }
  }, [keystore, router])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Wallet />
      </main>
    </div>
  );
}
