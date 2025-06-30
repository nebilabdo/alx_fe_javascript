let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" },
  { text: "The only limit is your mind.", category: "Mindset" }
];

const quoteDisplay = document.getElementById("quoteDisplay");

// Create category filter dropdown
const categoryFilter = document.createElement("select");
categoryFilter.id = "categoryFilter";
categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
categoryFilter.onchange = filterQuotes;
document.body.insertBefore(categoryFilter, quoteDisplay);

// Notification element
const notification = document.createElement("div");
notification.id = "notification";
notification.style.display = "none";
notification.style.background = "#e6f7ff";
notification.style.borderLeft = "4px solid #007bff";
notification.style.padding = "10px";
notification.style.margin = "10px 0";
notification.style.color = "#333";
document.body.insertBefore(notification, categoryFilter);

// Show notification
function notify(message) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
}

// Populate categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastSelected = localStorage.getItem("selectedCategory");
  if (lastSelected) categoryFilter.value = lastSelected;
}

// Display random quote based on selected category
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Filter quotes
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// Create form to add quotes
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter a new quote';
  formContainer.appendChild(textInput);

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  formContainer.appendChild(categoryInput);

  const addButton = document.createElement('button');
  addButton.id = 'addQuoteBtn';
  addButton.textContent = 'Add Quote';
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Add new quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();
  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = '';
  document.getElementById("newQuoteCategory").value = '';
  notify("New quote added.");
}

// Simulate fetching from server (mock data)
async function fetchQuotesFromServer() {
  try {
    // Simulated server response (replace with fetch if using real API)
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    const simulatedServerQuotes = data.slice(0, 5).map(post => ({
  text: post.title,
  category: "API"
}));

    const serverData = JSON.stringify(simulatedServerQuotes);
    const localData = JSON.stringify(quotes);

    if (localData !== serverData) {
      quotes = simulatedServerQuotes;
      saveQuotes();
      populateCategories();
      showRandomQuote();
      notify("Quotes synced with server. Server data used to resolve conflicts.");
    } else {
      notify("No new updates from server.");
    }
  } catch (err) {
    console.error("Server sync failed:", err);
    notify("Error syncing with server.");
  }
// POST local quotes to mock server
async function postQuotesToServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    console.log("Successfully posted quotes to server:", result);
    notify("Local quotes synced to server.");
  } catch (err) {
    console.error("Failed to post quotes:", err);
    notify("Error syncing quotes to server.");
  }
}

// Modify addQuote to POST after adding locally
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();
  populateCategories();
  showRandomQuote();

  document.getElementById("newQuoteText").value = '';
  document.getElementById("newQuoteCategory").value = '';
  notify("New quote added.");

  // POST the updated quotes to server after adding a new quote
  postQuotesToServer();
}
}
async function syncQuotes() {
  try {
    // 1. Fetch quotes from server (GET)
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const serverDataRaw = await response.json();

    // Map server data to your quotes format
    const serverQuotes = serverDataRaw.slice(0, 5).map(post => ({
      text: post.title,
      category: "API"
    }));

    const localQuotesJSON = JSON.stringify(quotes);
    const serverQuotesJSON = JSON.stringify(serverQuotes);

    // 2. Conflict resolution: if server data differs, replace local data
    if (localQuotesJSON !== serverQuotesJSON) {
      // Example strategy: prioritize server data on conflict
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      showRandomQuote();
      notify("Quotes synced with server. Server data used to resolve conflicts.");
    } else {
      notify("No new updates from server.");
    }

    // Optional: post local changes back if needed
    // await postQuotesToServer();

  } catch (error) {
    console.error("Failed to sync quotes:", error);
    notify("Error syncing with server.");
  }
}

// Initialize and periodically sync
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();

  const showBtn = document.createElement("button");
  showBtn.id = "newQuote";
  showBtn.textContent = "Show New Quote";
  showBtn.onclick = showRandomQuote;
  document.body.insertBefore(showBtn, quoteDisplay);

  document.getElementById("addQuoteBtn").addEventListener("click", () => {
    addQuote();
    // Optionally sync after adding a quote
    syncQuotes();
  });

  showRandomQuote();

  // Initial sync
  syncQuotes();

  // Periodically check for new quotes every 30 seconds
  setInterval(syncQuotes, 30000);
});

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();

  const showBtn = document.createElement("button");
  showBtn.id = "newQuote";
  showBtn.textContent = "Show New Quote";
  showBtn.onclick = showRandomQuote;
  document.body.insertBefore(showBtn, quoteDisplay);

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  showRandomQuote();
  fetchQuotesFromServer(); // initial fetch
  setInterval(fetchQuotesFromServer, 30000); // sync every 30s
});
