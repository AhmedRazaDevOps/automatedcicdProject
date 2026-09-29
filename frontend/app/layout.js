import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Next.js User App | Monorepo Platform',
  description: 'User-facing web application powered by Next.js and .NET REST API backend',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main className="container">
          {children}
        </main>

        <footer>
          <div className="container">
            <p>© 2026 Monorepo Platform. .NET REST API + Next.js + Vue 3 + MySQL.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
