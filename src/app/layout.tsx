import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Portkey: A User-Friendly and Secure AA Wallet for Asset Management and Web3 Experience',
  description: `Portkey is the first account abstraction (AA) wallet from aelf's ecosystem. Users can swiftly log into Portkey via their Web2 social info with no private keys or mnemonics required. Account creation is free for all users!`,
  keywords: ['DID', 'social recovery', 'crypto wallet', 'AA wallet'],
  viewport: {
    viewportFit: 'cover',
    width: 'device-width',
    initialScale: 1,
    userScalable: false,
    minimumScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
