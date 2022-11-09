import { createRoot } from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient();

const appElement = (
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </QueryClientProvider>
);

// In a browser environment, render instead of exporting
if (typeof window !== "undefined") {
  const container = document.getElementById("root")!;
  createRoot(container).render(appElement);
}

export default appElement;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint.
// Learn more: https://github.com/enactjs/cli/blob/master/docs/measuring-performance.md
reportWebVitals();
