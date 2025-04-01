import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import useWallet from "@/store/useWallet"
import { Loader2, RefreshCcw } from "lucide-react"

interface TokenBalance {
    symbol: string;
    balance: string;
    value: string;
    address: string;
}

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
];

const tokenAddresses = [
    "0x0000000000000000000000000000000000000000", // ETH
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
];


async function getTokenPrice(symbol: string) {
    const response = await fetch(`/api/token_price?symbol=${symbol}`);
    const data = await response.json();
    return data['USD'];
}

const Wallet = () => {
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { wallet } = useWallet()
    const walletAddress = wallet?.address || '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326'

    const fetchBalances = async (walletAddress: string) => {
        try {
            setIsLoading(true);
            const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/Ed5A1xLeD3fgkOMDF-zT2MMxy4JOKan6");
            const balances: TokenBalance[] = [];

            // ETH
            const ethBalance = await provider.getBalance(walletAddress);
            const ethValue = ethers.formatEther(ethBalance);
            const ethPrice = await getTokenPrice("ETH");
            console.log(ethPrice)
            const ethTotalValue = (parseFloat(ethValue) * ethPrice).toFixed(2);

            balances.push({
                symbol: "ETH",
                balance: parseFloat(ethValue).toFixed(4),
                value: `$ ${ethTotalValue}`,
                address: "ETH"
            });

            // 其他代幣
            for (const tokenAddress of tokenAddresses) {
                if (tokenAddress === "0x0000000000000000000000000000000000000000") continue; // 跳过 ETH

                const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
                try {
                    const balance = await contract.balanceOf(walletAddress);
                    const decimals = await contract.decimals();
                    const symbol = await contract.symbol();
                    const formattedBalance = ethers.formatUnits(balance, decimals);
                    const tokenPrice = await getTokenPrice(symbol);
                    const totalPrice = (parseFloat(formattedBalance) * tokenPrice).toFixed(2);
                    balances.push({
                        symbol,
                        balance: parseFloat(formattedBalance).toFixed(2),
                        value: `$ ${totalPrice}`, // 
                        address: tokenAddress
                    });
                } catch (error) {
                    console.error("餘額獲取失敗", error);
                }
            }

            setTokenBalances(balances);
        } catch (error) {
            console.error("餘額獲取失敗", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBalances(walletAddress);
    }, [wallet]);

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">CTHua-Wallet</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    ) : tokenBalances.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">資產總覽 <Button variant="outline" size="icon" className="ml-2 cursor-pointer" onClick={() => fetchBalances(walletAddress)}><RefreshCcw /></Button></h3>
                            <div className="space-y-2">
                                {tokenBalances.map((token, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">{token.symbol}</span>
                                            <span className="text-gray-500">{token.balance}</span>
                                        </div>
                                        <span className="text-gray-600">{token.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default Wallet
