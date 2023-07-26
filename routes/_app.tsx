import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href={asset("/favicon.svg")} />
        <style>
          {`
            body { background: rgb(248, 250, 252); }
            @media (prefers-color-scheme: dark) { body { background: rgb(15, 23, 42); } }
            a:active { opacity: 0.7 }
          `}
        </style>
      </Head>
      <Component />
    </>
  );
}
