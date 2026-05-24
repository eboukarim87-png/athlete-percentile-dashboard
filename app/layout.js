export const metadata = {
  title: 'Athlete Percentile Dashboard',
  description: 'Athlete benchmarking dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
