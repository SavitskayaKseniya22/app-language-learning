import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ModalProvider } from "./shared/ui/modal";
import "@app/styles/styles.scss";
import { Spinner } from "./shared/ui/spinner";
import { AuthProvider } from "./features/auth";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { store } from "./app/store";
import { router } from "./app/routes";
import AppErrorBoundary from "./app/app-error-boundary";

const root = ReactDOM.createRoot(document.querySelector("#root") as HTMLElement);

root.render(
    <React.StrictMode>
        <AppErrorBoundary>
            <Suspense fallback={<Spinner />}>
                <Provider store={store}>
                    <AuthProvider>
                        <ModalProvider>
                            <RouterProvider router={router} />
                        </ModalProvider>
                    </AuthProvider>
                </Provider>
            </Suspense>
        </AppErrorBoundary>
    </React.StrictMode>,
);
