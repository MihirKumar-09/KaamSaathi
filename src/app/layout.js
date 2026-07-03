import "./globals.css";

export const metadata = {
  title: "KaamSaathi",
  description: "FInd jobs easily",
  icons: {
    icon: "/logo/appLogo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
