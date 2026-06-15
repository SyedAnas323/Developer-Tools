import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Strong Password Generator Free - Create Secure Passwords Instantly | MyToolsHub',
  description:
    'Generate strong, random, and secure passwords instantly. Customize length, symbols, numbers, and uppercase. 100% free, no signup, never stored.',
  keywords: [
    'password generator',
    'strong password generator',
    'secure password generator',
    'random password generator',
    'create strong password',
    'password maker',
    'password creator',
    'generate password online',
    'secure password tool',
    'random password creator',
    'online password generator',
    'password security tool',
    'unique password generator',
    'free password generator',
  ],
  slug: 'password-generator',
});

export default function Layout({ children }) {
  return <>{children}</>;
}

