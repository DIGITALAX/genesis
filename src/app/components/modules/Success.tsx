import { ModalContext } from "@/app/providers";
import { useContext } from "react";

export const Success = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context?.successData) return null;

  const explorerUrl = context?.successData?.txHash
    ? `https://explorer.lens.xyz/tx/${context?.successData.txHash}`
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-pointer"
      onClick={context?.hideSuccess}
    >
      <div
        className="relative w-full max-w-md h-fit flex flex-col gap-4 p-6 bg-green-400/90 rounded-sm cursor-default text-center justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-pink-600 leading-relaxed whitespace-pre-wrap break-words">
          {context?.successData?.message}
        </p>

        {context?.successData?.txHash && (
          <div className="relative w-full flex flex-col gap-2">
            <p className="text-xs text-pink-600">{dict?.transactionHash}</p>
            {explorerUrl ? (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-pink-600 hover:opacity-70 transition-opacity break-all mix-blend-color-dodge"
              >
                {context?.successData?.txHash}
              </a>
            ) : (
              <p className="text-xs text-pink-600 break-all mix-blend-color-dodge">
                {context?.successData?.txHash}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
