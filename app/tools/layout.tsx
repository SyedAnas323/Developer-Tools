import Navbar from '@/components/Navbar';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}