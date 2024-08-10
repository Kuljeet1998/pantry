'use client'
import dynamic from 'next/dynamic'

const LoginPage = dynamic(() => import('./login'), {
    ssr: false,
});

export default function Home() {
  return (
    <LoginPage></LoginPage>
  );
}
