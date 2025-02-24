import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContributors } from "../store/contributorsSlice";
import { RootState, AppDispatch } from "../store/store";

export const useFetchContributors = (repo: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const contributors = useSelector(
        (state: RootState) => state.contributors.contributors[repo?.id] || []
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!repo) return;

        const cacheKey = `contributors-${repo.owner.login}-${repo.name}`;
        const cachedContributors = JSON.parse(localStorage.getItem(cacheKey) || "null");

        if (cachedContributors) {
            dispatch({
                type: "contributors/fetchContributors/fulfilled",
                payload: { repo: repo.name, contributors: cachedContributors },
            });
            setLoading(false);
        } else {
            dispatch(fetchContributors({ owner: repo.owner.login, repo: repo.name })).finally(() => {
                setLoading(false);
            });
        }
    }, [repo, dispatch]);

    return { contributors, loading };
};
