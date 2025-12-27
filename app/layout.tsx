import "./globals.css";
import { ReduxProvider } from '../store/Provider';

export const metadata = {
  title: "Axiom Pulse Clone",
  description: "Token discovery dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
