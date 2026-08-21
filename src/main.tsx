import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import Spinner from "./components/spinner/Spinner";

import { store } from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <Suspense fallback={<Spinner />}>
            <Provider store={store}>
                <App />
            </Provider>
        </Suspense>
    </React.StrictMode>,
);
