import { GENESIS_CONTRACT } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useContext, useState, useEffect } from "react";
import {
  useAccount,
  useConfig,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { getWalletClient } from "wagmi/actions";
import { chains } from "@lens-chain/sdk/viem";
import GenesisAbi from "./../../abis/GenesisNFT.json";

const useMint = (dict: any) => {
  const { address, chainId } = useAccount();
  const config = useConfig();
  const publicClient = usePublicClient();
  const context = useContext(ModalContext);
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [verifiedLoading, setVerifiedLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<{
    minted: number;
    canMint: boolean;
  }>({
    minted: 0,
    canMint: false,
  });

  const checkAuthorized = async () => {
    if (!address || !publicClient) return;
    setVerifiedLoading(true);
    try {
      const [isAuthorized, balance] = await Promise.all([
        publicClient.readContract({
          address: GENESIS_CONTRACT,
          abi: GenesisAbi,
          functionName: "isAuthorizedMinter",
          args: [address],
        }),
        publicClient.readContract({
          address: GENESIS_CONTRACT,
          abi: GenesisAbi,
          functionName: "balanceOf",
          args: [address],
        }),
      ]);

      setVerified({
        canMint: isAuthorized as boolean,
        minted: Number(balance),
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setVerifiedLoading(false);
  };

  useEffect(() => {
    if (!verified.canMint && address && publicClient) {
      checkAuthorized();
    }
  }, [address, publicClient]);

  const handleMint = async () => {
    if (!address || !publicClient || Number(verified?.minted) > 0) return;
    if (!verified?.canMint) {
      context?.showError(dict?.notEligible);
      return;
    }
    setMintLoading(true);
    try {
      let client = walletClient;
      if (chainId !== chains.mainnet.id) {
        await switchChainAsync({ chainId: chains.mainnet.id });
        client = await getWalletClient(config, {
          chainId: chains.mainnet.id,
        });
      }
      if (!client || (await client.getChainId()) !== chains.mainnet.id) {
        throw new Error("Wallet is not on Lens Chain");
      }
      const hash = await client.writeContract({
        address: GENESIS_CONTRACT,
        abi: GenesisAbi,
        functionName: "mint",
        args: [],
        account: address,
        chain: chains.mainnet,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.mintSuccess, hash);
      setVerified({
        canMint: true,
        minted: 1,
      });
    } catch (err: any) {
      context?.showError(dict?.error);
      console.error(err.message);
    }
    setMintLoading(false);
  };

  return {
    mintLoading,
    verifiedLoading,
    verified,
    handleMint,
  };
};

export default useMint;
