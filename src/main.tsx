import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import Spinner from "./components/spinner/Spinner";
import { store } from "./store/store";
import { RouterProvider } from "react-router-dom";
import ModalProvider from "./components/modal/ModalProvider";
import router from "./router";
import "./assets/styles/styles.scss";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <Suspense fallback={<Spinner />}>
            <Provider store={store}>
                <ModalProvider>
                    <RouterProvider router={router} />
                </ModalProvider>
            </Provider>
        </Suspense>
    </React.StrictMode>,
);
