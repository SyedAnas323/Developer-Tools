import { createToolMetadata, ToolFaqSchema } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Strong Password Generator Free - Create Secure Passwords Instantly | MyToolsHub',
  description:
    'Generate strong, random, and secure passwords instantly. Customize length, symbols, numbers, and uppercase. 100% free, no signup, never stored.',
  keywords: ['strong password generator', 'random password generator free', 'secure password generator online', 'password generator no signup', 'generate complex password free'],
  slug: 'password-generator',
});

export default function Layout({ children }) {
  return <>
      {children}
      <ToolFaqSchema slug='password-generator' />
    </>;
}

