import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const DarkModeToggle = () => {
    const [theme, setTheme] = useState(() => {
        return typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
            ? "dark"
            : "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <Button variant="secondary" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </Button>
    );
};

export default DarkModeToggle;