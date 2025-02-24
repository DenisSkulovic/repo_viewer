import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepos } from "../store/githubSlice";
import { RootState, AppDispatch } from "../store/store";
import { useInView } from "react-intersection-observer";

export const useFetchRepos = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { repos, status, username, hasMore } = useSelector(
        (state: RootState) => state.github
    );
    const { ref, inView } = useInView();
    const [hydrated, setHydrated] = useState(false);
    const [inputUsername, setInputUsername] = useState(username);
    const [sortedRepos, setSortedRepos] = useState(repos);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (
            hydrated &&
            inView &&
            status !== "loading" &&
            hasMore &&
            username &&
            repos.length === 0
        ) {
            dispatch(fetchRepos());
        }
    }, [hydrated, dispatch, inView, status, hasMore, username]);

    useEffect(() => {
        setSortedRepos([...repos].sort((a, b) => (sortOrder === "desc" ? b.stargazers_count - a.stargazers_count : a.stargazers_count - b.stargazers_count)));
    }, [repos, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
    };

    return {
        ref,
        hydrated,
        inputUsername,
        setInputUsername,
        sortedRepos,
        toggleSortOrder,
        sortOrder,
    };
};
export default useFetchRepos;