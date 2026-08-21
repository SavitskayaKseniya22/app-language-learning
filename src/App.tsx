import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import Spinner from "./components/spinner/Spinner";
import GlobalStyle from "./styled/GlobalStyle";
import ModalProvider from "./components/modal/ModalProvider";

function App() {
    return (
        <ModalProvider>
            <GlobalStyle />
            <RouterProvider router={router} fallbackElement={<Spinner />} />
        </ModalProvider>
    );
}

export default App;
