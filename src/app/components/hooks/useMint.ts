import { ModalContext } from "@/app/providers";
import { useContext, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const useMint = (dict: any) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const context = useContext(ModalContext);
  const { data: walletClient } = useWalletClient();
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<{
    minted: number;
    canMint: boolean;
  }>({
    minted: 0,
    canMint: false,
  });

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
        address: "0xE69dAB02100d3989bCA736a0FE1239CbFcf2cE01",
        abi: [
          {
            type: "function",
            name: "mint",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
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
    handleMint,
  };
};

export default useMint;
