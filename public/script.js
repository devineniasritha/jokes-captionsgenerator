document.addEventListener("DOMContentLoaded", () => {
    // Load jokes and captions from local files
    fetch("jokes.json")
        .then(response => response.json())
        .then(data => populateCategories(data, "joke"))
        .catch(error => console.error("Error loading jokes.json:", error));

    fetch("captions.json")
        .then(response => response.json())
        .then(data => populateCategories(data, "caption"))
        .catch(error => console.error("Error loading captions.json:", error));

    // Set default section to Jokes
    showSection("joke");

    // Add event listeners for sidebar navigation
    document.getElementById("nav-jokes").addEventListener("click", () => showSection("joke"));
    document.getElementById("nav-captions").addEventListener("click", () => showSection("caption"));
});

// Show the selected section and hide the other
function showSection(type) {
    document.getElementById("joke-section").style.display = type === "joke" ? "block" : "none";
    document.getElementById("caption-section").style.display = type === "caption" ? "block" : "none";
}

// Populate categories dynamically from JSON
function populateCategories(data, type) {
    const categoriesContainer = document.querySelector(`#${type}-section .categories`);
    categoriesContainer.innerHTML = ""; // Clear previous buttons

    Object.keys(data).forEach(category => {
        const button = document.createElement("button");
        button.classList.add("category-btn");
        button.setAttribute("data-category", category);
        button.innerText = category;

        button.addEventListener("click", () => fetchContent(category, type));
        categoriesContainer.appendChild(button);
    });
}

// Fetch and display content (joke or caption) based on category
// Store last displayed joke/caption per category
const lastDisplayed = {
    joke: "",
    caption: ""
};

// Fetch and display content (joke or caption) based on category
function fetchContent(category, type) {
    const fileName = type === "joke" ? "jokes.json" : "captions.json";
    const displayElement = document.getElementById(type === "joke" ? "joke-text" : "caption-text");

    // Reset content to indicate loading
    displayElement.innerText = "Loading...";

    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            const contentArray = data[category];

            if (contentArray && contentArray.length > 0) {
                let newText;

                // Keep picking a new joke/caption until it's different from the last one
                if (contentArray.length === 1) {
                    newText = contentArray[0]; // If only one item exists, no need to check
                } else {
                    do {
                        newText = contentArray[Math.floor(Math.random() * contentArray.length)];
                    } while (newText === lastDisplayed[type]); // Prevent immediate repetition
                }

                // Store the displayed content
                lastDisplayed[type] = newText;
                displayElement.innerText = newText;
            } else {
                displayElement.innerText = `No ${type}s available for this category.`;
            }
        })
        .catch(error => {
            console.error(`Error fetching ${type}:`, error);
            displayElement.innerText = "Failed to load content.";
        });
}


