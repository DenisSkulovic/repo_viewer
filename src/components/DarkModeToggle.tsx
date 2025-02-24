import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const newTheme = darkMode ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setDarkMode(!darkMode);
    };

    return (
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
    );
}

export default DarkModeToggle;