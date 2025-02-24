import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
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
    const [inputUsername, setInputUsername] = useState(username); // ✅ Separate input field state

    // ensures the page waits for hydration
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
    }, [hydrated, dispatch, inView, status, hasMore, username]); // ✅ Removed `repos.length` from dependencies


    const handleSearch = () => {
        console.log("dispatching setUsername");
        dispatch(setUsername(inputUsername));

        console.log("resetting repos");
        dispatch(resetRepos());

        console.log("fetching repos");
        dispatch(fetchRepos());

        console.log("done handleSearch");
    };


    if (!hydrated) return null;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h1>GitHub Repo Explorer</h1>
                <DarkModeToggle />
            </div>

            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter GitHub username"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)} // ✅ Only updates local state
                />
                <Button onClick={handleSearch} variant="primary">
                    Search
                </Button>
            </div>

            {repos.map((repo) => (
                <Link href={`/repo/${repo.id}`} passHref key={repo.id}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>{repo.name}</Card.Title>
                            <Card.Text>{repo.description || "No description available"}</Card.Text>
                            <div>
                                ⭐ {repo.stargazers_count} | 🏷 {repo.language || "Unknown"}
                            </div>
                        </Card.Body>
                    </Card>
                </Link>
            ))}

            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="text-center">
                <LoadingSpinner />
            </div>
        </Container>
    );
}
