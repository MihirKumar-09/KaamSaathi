import "./globals.css";
import { AuthProvider } from "@/provider/AuthProvider";
import { ToastProvider } from "@/provider/ToastProvider";

export const metadata = {
  title: "KaamSaathi",
  description: "Find jobs easily",
  icons: {
    icon: "/logo/appLogo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
