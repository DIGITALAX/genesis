import { JSX } from "react";
import ModalsEntry from "./ModalsEntry";

export default function Wrapper({
  dict,
  page,
}: {
  dict: any;
  page: JSX.Element;
}) {
  return (
    <>
      {page}
      <ModalsEntry dict={dict} />
    </>
  );
}
