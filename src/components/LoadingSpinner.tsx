import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const LoadingSpinner = () => {
    const status = useSelector((state: RootState) => state.github.status);

    if (status !== "loading") return null;

    return (
        <div className="text-center my-3">
            <Spinner animation="border" />
        </div>
    );
};

export default LoadingSpinner;
