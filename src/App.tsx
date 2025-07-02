import type { AppProps } from 'next/app';
import LLMInjection from './components/LLMInjection';
import Canonical from './components/Canonical';

export default function App({ Component, pageProps }: AppProps) {
  const isLLMBot = true;
  return (
    <>
      <Canonical />
      <LLMInjection isLLMBot={isLLMBot} />
      <Component {...pageProps} />
    </>
  );
}
