import { Geist, Geist_Mono } from "next/font/google";
import { Roboto } from "next/font/google";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import { Box, CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import theme from "./theme";
import { Header } from "./components";
import { MuiToolBar } from "./components/AppBar";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata = {
  title: "Fly IO",
  description: "Fly IO",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <AppRouterCacheProvider options={{ key: "css" }}>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
              {/* <Header /> */}
              <Box component="main" sx={{ p: 3, width: "100%" }}>
                <MuiToolBar />
                {children}
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
