import { useDispatch } from "react-redux";
import { setUsername, resetRepos, fetchRepos } from "../store/githubSlice";
import DarkModeToggle from "../components/DarkModeToggle";
import LoadingSpinner from "../components/LoadingSpinner";
import Link from "next/link";
import { useFetchRepos } from "../hooks/useFetchRepos";

export default function Home() {
    const dispatch = useDispatch();
    const {
        ref,
        hydrated,
        inputUsername,
        setInputUsername,
        sortedRepos,
        toggleSortOrder,
        sortOrder,
    } = useFetchRepos();

    const handleSearch = () => {
        dispatch(setUsername(inputUsername));
        dispatch(resetRepos());
        dispatch(fetchRepos());
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

            {sortedRepos.length > 0 && (
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
