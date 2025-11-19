"use client";

import { FunctionComponent, JSX } from "react";
import Header from "./Header";
import useMint from "../hooks/useMint";
import { useAccount } from "wagmi";
import { AiOutlineLoading } from "react-icons/ai";

const Entry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const { mintLoading, handleMint } = useMint(dict);
  const { address, isConnected } = useAccount();
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between">
      <Header dict={dict} />
      <div className="flex w-full h-full relative items-center justify-center">
        <button
          disabled={!isConnected || !address || mintLoading}
          className="relative w-24 h-fit px-3 py-2 rounded-sm bg-green-400 text-pink-600 text-center items-center justify-center flex mix-blend-color-dodge"
          onClick={() => handleMint()}
        >
          {mintLoading ? (
            <AiOutlineLoading className="animate-spin" size={20} />
          ) : (
            dict?.mint
          )}
        </button>
      </div>
      <div className="relative bottom-0 w-full h-fit text-center left-0 flex text-[4vw] leading-none justify-end mix-blend-color-dodge text-white">
        {dict?.footer}
      </div>
    </div>
  );
};

export default Entry;
