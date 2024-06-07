import { montserrat } from './ui/fonts';
import './ui/global.css'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard', //%s: se remplazará con el titulo especifico de cada pagina
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* descarga y optimiza la fuente desde Google fonts */}
      <body className={`${montserrat.className} antialiased`}>
        {children}
        <footer className='py-10 flex justify-center items-center'>
          Echo con ❤️ por la gente de Vercel
        </footer>
      </body>
    </html>
  );
}
