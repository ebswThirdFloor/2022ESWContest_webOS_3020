import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const appElement = (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

if (typeof window !== "undefined") {
  const container = document.getElementById("root")!;
  createRoot(container).render(appElement);
}

export default appElement;
