import InstallCard from '@/components/InstallCard';

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 640, margin: '0 auto' }}>
      <h1>Global Frontend</h1>
      <p>GitHub App 安装入口与授权管理</p>
      <InstallCard />
    </main>
  );
}
