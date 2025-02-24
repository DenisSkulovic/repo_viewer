import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepos, setUsername, resetRepos } from "../store/githubSlice";
import { RootState, AppDispatch } from "../store/store";
import DarkModeToggle from "../components/DarkModeToggle";
import LoadingSpinner from "../components/LoadingSpinner";
import Link from "next/link";

export default function Home() {
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

    const handleSearch = () => {
        dispatch(setUsername(inputUsername));
        dispatch(resetRepos());
        dispatch(fetchRepos());
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
    };

    if (!hydrated) return null;

    return (
        <div className="container">
            <div className="d-flex justify-between">
                <h1>GitHub Repo Explorer</h1>
                <DarkModeToggle />
            </div>

            <div className="input-group">
                <input
                    type="text"
                    placeholder="Enter GitHub username"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {repos.length > 0 && (
                <button className="btn btn-secondary" onClick={toggleSortOrder}>
                    Sort by Stars ({sortOrder === "desc" ? "Descending" : "Ascending"})
                </button>
            )}

            {sortedRepos.map((repo) => (
                <Link href={`/repo/${repo.id}`} key={repo.id}>
                    <div className="card">
                        <h2 className="card-title">{repo.name}</h2>
                        <p className="card-text">{repo.description || "No description available"}</p>
                        <div>
                            ⭐ {repo.stargazers_count} | 🏷 {repo.language || "Unknown"}
                        </div>
                    </div>
                </Link>
            ))}

            <div ref={ref} className="text-center">
                <LoadingSpinner />
            </div>
        </div>
    );
}
