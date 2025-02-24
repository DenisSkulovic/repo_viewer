import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Contributor {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

interface ContributorState {
    contributors: Record<string, Contributor[]>;
    status: "idle" | "loading" | "failed";
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

const initialState: ContributorState = loadFromCache("contributorsState") || {
    contributors: {},
    status: "idle",
};

export const fetchContributors = createAsyncThunk(
    "contributors/fetchContributors",
    async ({ owner, repo }: { owner: string; repo: string }) => {
        const cacheKey = `contributors-${owner}-${repo}`;
        const cachedContributors = loadFromCache(cacheKey);

        if (cachedContributors) {
            return { repo, contributors: cachedContributors };
        }

        const res = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`
        );

        saveToCache(cacheKey, res.data);
        return { repo, contributors: res.data };
    }
);

const contributorsSlice = createSlice({
    name: "contributors",
    initialState,
    reducers: {},
    extraReducers: (builder: any) => {
        builder
            .addCase(fetchContributors.pending, (state: any) => {
                state.status = "loading";
            })
            .addCase(fetchContributors.fulfilled, (state: any, action: any) => {
                state.status = "idle";
                state.contributors[action.payload.repo] = action.payload.contributors;
                saveToCache("contributorsState", state);
            })
            .addCase(fetchContributors.rejected, (state: any) => {
                state.status = "failed";
            });
    },
});

export default contributorsSlice.reducer;
