// Initial quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is short, smile while you still have teeth.", category: "Humor" }
];

// Load last filter
let lastFilter = localStorage.getItem("lastFilter") || "all";

// Show a random quote
function showRandomQuote() {
  const filteredQuotes = quotes.filter(q => lastFilter === "all" || q.category === lastFilter);
  const random = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = random ? `<p>"${random.text}" - <em>${random.category}</em></p>` : "No quote available.";
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
  select.value = lastFilter;
}

// Filter quotes
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  lastFilter = category;
  localStorage.setItem("lastFilter", category);
  showRandomQuote();
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) return alert("Please fill both fields!");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = '';
  document.getElementById("newQuoteCategory").value = '';
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Export quotes to JSON file
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

// Import quotes from JSON file
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

// Event listener
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initial load
populateCategories();
showRandomQuote();
function syncWithServer() {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(serverData => {
      // Example conflict resolution: server data takes precedence
      console.log("Simulated server sync complete");
      // You could compare and merge if needed
    });
}

// Sync every 30 seconds
setInterval(syncWithServer, 30000);
