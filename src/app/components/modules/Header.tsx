"use client";

import { FunctionComponent, JSX } from "react";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Header: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const router = useRouter();
  const path = usePathname();

  const changeLanguage = () => {
    const segments = path.split("/").filter(Boolean);
    const currentLang = segments[0] && ["en", "es", "pt"].includes(segments[0]) ? segments[0] : "en";

    const nextLang = currentLang === "en" ? "es" : currentLang === "es" ? "pt" : "en";

    if (segments[0] && ["en", "es", "pt"].includes(segments[0])) {
      segments[0] = nextLang;
    } else {
      segments.unshift(nextLang);
    }

    const newPath = `/${segments.join("/")}`;

    document.cookie = `NEXT_LOCALE=${nextLang}; path=/; SameSite=Lax`;

    router.push(newPath);
  };

  const getCurrentLang = () => {
    const segments = path.split("/").filter(Boolean);
    return segments[0] && ["en", "es", "pt"].includes(segments[0]) ? segments[0] : "en";
  };

  const currentLang = getCurrentLang();

  return (
    <div className="relative w-full h-fit top-0 left-0 right-0 z-50 text-xxs">
      <div className="flex items-center justify-center sm:justify-between sm:gap-0 gap-3 py-2 px-2 sm:px-6 h-fit sm:h-16 flex-wrap">
        <div className="relative w-fit h-fit flex gap-2 justify-center items-center flex-row">
          <Link
            href="/"
            className="tracking-wide mix-blend-color-dodge text-white hover:opacity-70 transition-opacity font-wizard text-2xl"
          >
            GENESIS
          </Link>
        </div>
        <nav className="flex justify-center items-center gap-2 sm:gap-8 flex-wrap">
          <button
            onClick={changeLanguage}
            className="text-white mix-blend-color-dodge hover:opacity-70 transition-opacity"
          >
            {currentLang === "en"
              ? "CASTELLANO"
              : currentLang === "es"
              ? "BRASILEÑO"
              : "AUSSIE"}
          </button>

          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress }) => {
              return (
                <button
                  onClick={show}
                  className="text-white mix-blend-color-dodge hover:opacity-70 transition-opacity"
                >
                  {isConnected ? truncatedAddress : dict?.connect}
                </button>
              );
            }}
          </ConnectKitButton.Custom>
        </nav>
      </div>
    </div>
  );
};

export default Header;
