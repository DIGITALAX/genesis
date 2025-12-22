import { GENESIS_CONTRACT } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useContext, useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import GenesisAbi from "./../../abis/GenesisNFT.json";

const useMint = (dict: any) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const context = useContext(ModalContext);
  const { data: walletClient } = useWalletClient();
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
      const [isAuthorized, hasMinted] = await Promise.all([
        publicClient.readContract({
          address: GENESIS_CONTRACT,
          abi: GenesisAbi,
          functionName: "isAuthorizedMinter",
          args: [address],
        }),
        publicClient.readContract({
          address: GENESIS_CONTRACT,
          abi: GenesisAbi,
          functionName: "hasMinted",
          args: [address],
        }),
      ]);

      setVerified({
        canMint: isAuthorized as boolean,
        minted: (hasMinted as boolean) ? 1 : 0,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setVerifiedLoading(false);
  };

  useEffect(() => {
    checkAuthorized();
  }, [address, publicClient]);

  const handleMint = async () => {
    if (
      !address ||
      !publicClient ||
      !walletClient ||
      Number(verified?.minted) > 0
    )
      return;
    if (!verified?.canMint) {
      context?.showError(dict?.notEligible);
      return;
    }
    setMintLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: GENESIS_CONTRACT,
        abi: GenesisAbi,
        functionName: "mint",
        args: [],
        account: address,
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
