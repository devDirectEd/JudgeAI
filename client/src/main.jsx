import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { persistor, store } from "./redux/ReduxStore.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
