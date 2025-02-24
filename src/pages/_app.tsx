import { Provider } from "react-redux";
import { store } from "../store/store";
import "../styles/global.scss";

function ReposApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: any }) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default ReposApp;