import '../src/index.css';
import '../src/App.css';
import '../src/WaitlistPage.css';
import 'react-loading-skeleton/dist/skeleton.css';
import type { AppProps } from 'next/app';
import App from '../src/App';

export default function MyApp(props: AppProps) {
  return <App {...props} />;
}
