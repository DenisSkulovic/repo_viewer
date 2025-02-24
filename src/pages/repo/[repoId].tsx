import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchContributors } from "../../store/contributorsSlice";
import { RootState, AppDispatch } from "../../store/store";
import Link from "next/link";

export default function RepoDetail() {
    const router = useRouter();
    const { repoId } = router.query;
    const dispatch = useDispatch<AppDispatch>();

    const repos = useSelector((state: RootState) => state.github.repos);
    const contributors = useSelector(
        (state: RootState) => state.contributors.contributors[repoId as string] || []
    );
    const status = useSelector((state: RootState) => state.contributors.status);

    const repo = repos.find((r) => r.id.toString() === repoId);
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

    if (!repo) {
        return (
            <div className="container text-center">
                <h3>Repository not found</h3>
                <Link href="/" className="btn btn-secondary">
                    Go Back
                </Link>
            </div>
        );
    }

    return (
        <div className="container">
            <button className="btn btn-secondary" onClick={() => router.back()}>🔙 Back</button>

            <div className="card">
                <h2 className="card-title">{repo.name}</h2>
                <p className="card-text">{repo.description || "No description available"}</p>
                <div className="repo-info">
                    ⭐ {repo.stargazers_count} | 🏷 {repo.language || "Unknown"} | 🕒 Last updated:{" "}
                    {new Date(repo.updated_at).toLocaleDateString()}
                </div>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-3">
                    View on GitHub
                </a>
            </div>

            <h3 className="mt-4">Top Contributors</h3>
            {loading ? (
                <div className="spinner"></div>
            ) : (
                <ul className="contributors">
                    {contributors.length > 0 ? contributors.map((contributor) => (
                        <li key={contributor.login}>
                            <img
                                src={contributor.avatar_url}
                                alt={contributor.login}
                                width="40"
                                height="40"
                            />
                            <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                                {contributor.login}
                            </a>
                            <span className="ms-auto">Commits: {contributor.contributions}</span>
                        </li>
                    )) : <p>No contributors found.</p>}
                </ul>
            )}
        </div>
    );
}
