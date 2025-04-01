import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import useKeystore from "@/store/useKeyStore"
import { ethers } from "ethers"
import useWallet from "@/store/useWallet"
import { useRouter } from 'next/navigation'

export function Register() {
    const [step, setStep] = useState(1)
    // 助記詞
    const [mnemonic, setMnemonic] = useState<string[]>(Array(12).fill(""))
    // 密碼
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const handleRegister = async () => {
        // 檢查密碼是否一致
        if (password !== passwordConfirm) {
            alert("密碼不一致")
            return
        }
        // 用密碼跟助記詞產生keystore
        const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic.join(" "))
        const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj)
        const keystore = await wallet.encrypt(password)

        const { setKeystore } = useKeystore.getState()
        setKeystore(keystore)
    }

    const handleCreateMnemonic = () => {
        const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase
        setMnemonic(mnemonic?.split(" ") ?? [])
        setStep(3)
    }
    const onInputMnemonic = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        // 如果剛好是 12 個字，則直接填入
        if (value.split(" ").length === 12) {
            setMnemonic(value.split(" "))
            return
        }

        const index = parseInt(e.target.id.split("-")[1])
        setMnemonic(prev => prev.map((w, i) => i === index ? value : w))
    }
    const handleImportMnemonic = () => {
        if (mnemonic.some(word => word === "")) {
            alert("助記詞不能空白")
            return
        }
        if (mnemonic.length !== 12) {
            alert("助記詞長度不正確")
            return
        }
        // 用 ethers 的 mnemonic 來驗證助記詞
        const wallet = ethers.Mnemonic.isValidMnemonic(mnemonic.join(" "))
        if (!wallet) {
            alert("助記詞不正確")
            return
        }
        setStep(3)
    }
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">CTHua-Wallet</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    {step === 1 && (
                        <>
                            <div className="flex flex-col space-y-1.5">
                                <Button onClick={() => setStep(2)}>匯入助記詞</Button>
                                <Button onClick={handleCreateMnemonic}>創建助記詞</Button>
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="mnemonic">助記詞</Label>
                                <div className="flex flex-wrap gap-2">
                                    {mnemonic.map((word, index) => (
                                        <Input key={index} id={`mnemonic-${index}`} placeholder={`${index + 1}`} value={word} onChange={onInputMnemonic} />
                                    ))}
                                </div>
                                <Button onClick={handleImportMnemonic}>下一步</Button>
                            </div>
                        </>

                    )}
                    {step === 3 && (
                        <>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">密碼</Label>
                                <Input id="password" placeholder="密碼" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="passwordConfirm">確認密碼</Label>
                                <Input id="passwordConfirm" placeholder="確認密碼" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                            </div>
                            <Button onClick={handleRegister}>註冊</Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export function Login() {
    const router = useRouter()
    const { keystore } = useKeystore()
    const [password, setPassword] = useState("")
    const { setWallet, setExpiredTime } = useWallet()

    const handleLogin = () => {
        const wallet = ethers.Wallet.fromEncryptedJsonSync(keystore, password)
        setWallet(wallet)

        // 30分鐘後過期
        setExpiredTime(Date.now() + 1000 * 60 * 30)

        // 跳轉到首頁
        router.push('/')
    }

    return <>
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">CTHua-Wallet</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">密碼</Label>
                    <Input id="password" placeholder="密碼" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button onClick={handleLogin}>登入</Button>
                </div>
            </CardContent>
        </Card>
    </>
}
