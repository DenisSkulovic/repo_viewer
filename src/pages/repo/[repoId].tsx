import { useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Card, Button, ListGroup, Spinner } from "react-bootstrap";
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

    useEffect(() => {
        const cacheKey = `contributors-${repo?.owner.login}-${repo?.name}`;
        const cachedContributors = JSON.parse(localStorage.getItem(cacheKey) || "null");
        if (cachedContributors) {
            dispatch({
                type: "contributors/fetchContributors/fulfilled",
                payload: { repo: repo?.name, contributors: cachedContributors },
            });
        } else if (repo) {
            dispatch(fetchContributors({ owner: repo.owner.login, repo: repo.name }));
        }
    }, [repo, dispatch]);

    if (!repo) {
        return (
            <Container className="mt-4 text-center">
                <h3>Repository not found</h3>
                <Link href="/" passHref>
                    <Button variant="secondary">Go Back</Button>
                </Link>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <Card.Title>{repo.name}</Card.Title>
                    <Card.Text>{repo.description || "No description available"}</Card.Text>
                    <div>
                        ⭐ {repo.stargazers_count} | 🏷 {repo.language || "Unknown"} | 🕒 Last updated:{" "}
                        {new Date(repo.updated_at).toLocaleDateString()}
                    </div>
                    <Button variant="primary" href={repo.html_url} target="_blank" className="mt-3">
                        View on GitHub
                    </Button>
                </Card.Body>
            </Card>

            <h3 className="mt-4">Top Contributors</h3>
            {status === "loading" ? (
                <Spinner animation="border" />
            ) : (
                <ListGroup>
                    {contributors.map((contributor) => (
                        <ListGroup.Item key={contributor.login} className="d-flex align-items-center">
                            <img
                                src={contributor.avatar_url}
                                alt={contributor.login}
                                width="40"
                                height="40"
                                className="rounded-circle me-3"
                            />
                            <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                                {contributor.login}
                            </a>
                            <span className="ms-auto">Commits: {contributor.contributions}</span>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            <Link href="/" passHref>
                <Button variant="secondary" className="mt-4">
                    Back to Search
                </Button>
            </Link>
        </Container>
    );
}
