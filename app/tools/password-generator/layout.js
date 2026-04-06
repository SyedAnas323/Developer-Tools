import { createToolMetadata } from '../metadata';

export const metadata = createToolMetadata({
  title: 'Strong Password Generator - Create Secure Passwords',
  description:
    'Generate strong, random, and secure passwords online with adjustable length and instant copy-ready output.',
  keywords: ['password generator', 'strong password', 'random password', 'secure password'],
  slug: 'password-generator',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
