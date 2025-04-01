'use client'
import { Register } from "@/components/Landing";
import useKeyStore from "@/store/useKeyStore";
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter()
  const { keystore } = useKeyStore()

  useEffect(() => {
    if (keystore) {
      router.push('/login')
    }
  }, [keystore, router])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Register />
      </main>
    </div>
  );
}
