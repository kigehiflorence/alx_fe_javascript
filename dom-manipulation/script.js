// Initial quotes array from localStorage or default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is short, smile while you still have teeth.", category: "Humor" }
];

// Load last selected category filter from localStorage
let lastFilter = localStorage.getItem("lastFilter") || "all";

// Also declare selectedCategory (for flexibility)
let selectedCategory = lastFilter;

// Show a random quote
function showRandomQuote() {
  const filteredQuotes = quotes.filter(q => selectedCategory === "all" || q.category === selectedCategory);
  const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = random
    ? `<p>"${random.text}" - <em>${random.category}</em></p>`
    : "<p>No quote available.</p>";
}

// Populate category dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = `<option value="all">All Categories</option>`;
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
  select.value = selectedCategory;
}

// Filter quotes based on selected category
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  lastFilter = category;
  selectedCategory = category;
  localStorage.setItem("lastFilter", category);
  showRandomQuote();
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill both fields!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = '';
  document.getElementById("newQuoteCategory").value = '';
}

// Export quotes to a JSON file
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Dynamically create the add quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const heading = document.createElement("h3");
  heading.textContent = "Add a New Quote";
  formContainer.appendChild(heading);

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";
  formContainer.appendChild(quoteInput);

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Category";
  formContainer.appendChild(categoryInput);

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;
  formContainer.appendChild(addButton);
}

// Fetch quotes from server and merge with local quotes
function fetchQuotesFromServer() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(serverData => {
      // Map posts to quote format
      const newQuotes = serverData.slice(0, 5).map(item => ({
        text: item.title,
        category: "Server"
      }));

      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      console.log("Fetched and merged new quotes from server.");
    })
    .catch(error => console.error("Error fetching quotes from server:", error));
}

// Simulate periodic server sync (calls fetchQuotesFromServer)
function syncWithServer() {
  console.log("Syncing with server...");
  fetchQuotesFromServer();
}

// Sync every 30 seconds
setInterval(syncWithServer, 30000);

// Event listener for "New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize application
createAddQuoteForm();
populateCategories();
showRandomQuote();
