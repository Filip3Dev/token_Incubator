import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { WagmiProvider } from "wagmi";
import { config } from "./util/config";
import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import "./index.css";
import "./polyfills";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
        debugMode={true}
          options={{
            language: "pt-BR"
          }}
          theme="auto"
          mode="light"
          customTheme={{
            "--ck-overlay-background": "rgba(77, 76, 76, 0.5)",
            "--ck-border-color": "rgb(228 228 228)"
          }}
        >
          <App />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
