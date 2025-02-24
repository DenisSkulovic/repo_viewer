import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useFetchContributors } from "../../hooks/useFetchContributors";

export default function RepoDetail() {
    const router = useRouter();
    const { repoId } = router.query;
    const repos = useSelector((state) => state.github.repos);
    const repo = repos.find((r) => r.id.toString() === repoId);
    const { contributors, loading } = useFetchContributors(repo);

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
            <button className="btn btn-secondary" onClick={() => router.back()}>
                🔙 Back
            </button>

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
                            <img src={contributor.avatar_url} alt={contributor.login} width="40" height="40" />
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
