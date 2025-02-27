import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthUserContextProvider from "./Context/authUserContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthUserContextProvider>
      <ToastContainer
        position="top-center"
        theme="dark"
        hideProgressBar={true}
        autoClose={1500}
      />
      <App />
    </AuthUserContextProvider>
  </QueryClientProvider>
);
