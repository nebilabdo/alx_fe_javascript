
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Save quotes and selected category to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate category dropdown from unique categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem('selectedCategory');
  if (lastFilter) {
    categoryFilter.value = lastFilter;
    filterQuotes();
  }
}

// Display a random quote (filtered or all)
function displayRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Filter quotes by selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  displayRandomQuote();
}

// Add a new quote and refresh UI
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) {
    alert("Please provide both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("quoteText").value = '';
  document.getElementById("quoteCategory").value = '';
  alert("Quote added successfully!");
}

// Export quotes as downloadable JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        notify("Quotes imported successfully!");
      } else {
        notify("Invalid JSON format.");
      }
    } catch (err) {
      notify("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Show user notifications
function notify(message) {
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 4000);
}

// Simulate server sync (server takes priority)
async function fetchQuotesFromServer() {
  try {
    // Simulated server data — replace with real API if needed
    const simulatedServerQuotes = [
      { text: "The only limit is your mind.", category: "Mindset" },
      { text: "Push yourself, because no one else will do it for you.", category: "Motivation" }
    ];

    const localData = JSON.stringify(quotes);
    const serverDataStr = JSON.stringify(simulatedServerQuotes);
    

    if (localData !== serverDataStr) {
      quotes = simulatedServerQuotes;
      saveQuotes();
      populateCategories();
      notify("Quotes synced with server. Server data used to resolve conflicts.");
    } else {
      notify("No updates from server.");
    }
  } catch (error) {
    notify("Failed to sync with server.");
    console.error(error);
  }
}

// Sync every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

// Initial page load
window.onload = function () {
  populateCategories();
  displayRandomQuote();
};
