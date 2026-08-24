import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import { RouterProvider } from "react-router-dom";
import ModalProvider from "./components/modal/modal-provider";
import router from "./app/router/router";
import "@app/styles/styles.scss";
import Spinner from "./components/spinner/spinner";

const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);

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
