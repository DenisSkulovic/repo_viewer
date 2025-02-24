import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const PER_PAGE = 10;

interface Repo {
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
    language: string;
    html_url: string;
    updated_at: string;
    owner: { login: string };
}

interface GitHubState {
    repos: Repo[];
    status: "idle" | "loading" | "failed";
    username: string;
    page: number;
    hasMore: boolean;
}

const loadFromCache = (key: string) => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

const saveToCache = (key: string, data: any) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(data));
    }
};

// loads cached state only on client-side to avoid SSR mismatches (hydration issue fix)
const initialState: GitHubState = loadFromCache("githubState") || {
    repos: [],
    status: "idle",
    username: "",
    page: 1,
    hasMore: true,
};

export const fetchRepos = createAsyncThunk(
    "github/fetchRepos",
    async (_: any, { getState }: { getState: any }) => {
        const state = getState() as { github: GitHubState };
        const { username, page } = state.github;

        if (!username) return { data: [], page }; // prevents empty username requests

        // loads cache first before fetching
        const cachedRepos = loadFromCache(`repos-${username}`);
        if (cachedRepos && cachedRepos.length >= (page - 1) * PER_PAGE) {
            return { data: cachedRepos.slice(0, page * PER_PAGE), page };
        }

        const res = await axios.get(
            `https://api.github.com/users/${username}/repos?per_page=${PER_PAGE}&page=${page}`
        );

        const newData = [...(cachedRepos || []), ...res.data];
        saveToCache(`repos-${username}`, newData);

        return { data: res.data, page };
    }
);

const githubSlice = createSlice({
    name: "github",
    initialState,
    reducers: {
        setUsername: (state: any, action: PayloadAction<string>) => {
            state.username = action.payload;
            state.repos = [];
            state.page = 1;
            state.hasMore = true;
        },
        resetRepos: (state: any) => {
            state.repos = [];
            state.page = 1;
            state.hasMore = true;
        },
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(fetchRepos.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(fetchRepos.fulfilled, (state: any, action: any) => {
                state.status = "idle";

                if (action.payload.data.length > 0) {
                    const newRepos = action.payload.data;
                    const existingRepoIds = new Set(state.repos.map((repo: Repo) => repo.id));

                    const filteredRepos = newRepos.filter(repo => !existingRepoIds.has(repo.id)); // ✅ Prevents duplicates!

                    if (filteredRepos.length > 0) {
                        state.repos = [...state.repos, ...filteredRepos];
                        state.page += 1;
                    }

                    saveToCache("githubState", state);
                } else {
                    state.hasMore = false;
                }
            })
            .addCase(fetchRepos.rejected, (state: any) => {
                state.status = "failed";
                state.hasMore = false; // prevents further requests when there was a fail
            });
    },
});

export const { setUsername, resetRepos } = githubSlice.actions;
export default githubSlice.reducer;
