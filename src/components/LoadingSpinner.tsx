import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const LoadingSpinner = () => {
    const status = useSelector((state: RootState) => state.github.status);

    if (status !== "loading") return null;

    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;