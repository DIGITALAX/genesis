import { useContext } from "react";
import { ModalContext } from "@/app/providers";

export const Error = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context?.errorData) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-pointer"
      onClick={context?.hideError}
    >
      <div
        className="relative w-full max-w-md h-fit flex flex-col gap-4 p-6 bg-green-400/90 rounded-sm cursor-default text-center justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-white leading-relaxed whitespace-pre-wrap break-words">
          {context?.errorData?.message}
        </p>
      </div>
    </div>
  );
};
