let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" },
  { text: "The only limit is your mind.", category: "Mindset" }
];

const quoteDisplay = document.getElementById("quoteDisplay");

// Create and append category filter dropdown
const categoryFilter = document.createElement("select");
categoryFilter.id = "categoryFilter";
categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
categoryFilter.onchange = filterQuotes;
document.body.insertBefore(categoryFilter, quoteDisplay);

// Function to populate unique categories in the dropdown
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
  if (lastSelected) {
    categoryFilter.value = lastSelected;
  }
}

// Function to show a quote randomly based on filter
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

// Filter quotes and store filter preference
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// Function to create the quote form dynamically
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

// Function to add a quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  localStorage.setItem("quotes", JSON.stringify(quotes));

  document.getElementById("newQuoteText").value = '';
  document.getElementById("newQuoteCategory").value = '';

  populateCategories();
  showRandomQuote();
}

// DOM load events
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
});
