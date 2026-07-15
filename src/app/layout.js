import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
