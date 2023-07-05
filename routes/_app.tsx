import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";
import { checkIsDemo } from "🛠️/host.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href={asset("/favicon.svg")} />
        {checkIsDemo() && (
          <meta
            name="google-site-verification"
            content="j1D6NkT1hC4lolOCSOZnUwHHr55U7vtNl6uKtcF9_3w"
          />
        )}
        <style>
          {/* todo: add tailwind classes to body element */}
          {`
          body { background: rgb(248, 250, 252); } 
          @media (prefers-color-scheme: dark) { body { background: rgb(15, 23, 42); } }
          `}
        </style>
      </Head>
      <Component />
    </>
  );
}
