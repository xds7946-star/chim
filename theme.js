(() => {
    const STORAGE_KEY = "balans-theme";
    const root = document.documentElement;

    function getPreferredTheme() {
        let saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            saved = null;
        }
        if (saved === "light" || saved === "dark") {
            return saved;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);

        const toggle = document.getElementById("theme-toggle");
        if (!toggle) {
            return;
        }

        const icon = toggle.querySelector("ion-icon");
        const text = toggle.querySelector(".theme-toggle__text");
        const isDark = theme === "dark";

        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.setAttribute("title", isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему");
        toggle.setAttribute("aria-label", isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему");

        if (icon) {
            icon.setAttribute("name", isDark ? "sunny-outline" : "moon-outline");
        }
        if (text) {
            text.textContent = isDark ? "Світла" : "Темна";
        }
    }

    function initThemeToggle() {
        const currentTheme = getPreferredTheme();
        applyTheme(currentTheme);

        const toggle = document.getElementById("theme-toggle");
        if (!toggle) {
            return;
        }

        toggle.addEventListener("click", () => {
            const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            try {
                localStorage.setItem(STORAGE_KEY, nextTheme);
            } catch (error) {
                /* ігноруємо обмеження сховища */
            }
            applyTheme(nextTheme);
        });
    }

    root.setAttribute("data-theme", getPreferredTheme());
    document.addEventListener("DOMContentLoaded", initThemeToggle);
})();
