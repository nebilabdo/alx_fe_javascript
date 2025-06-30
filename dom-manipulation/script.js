let quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" },
  { text: "The only limit is your mind.", category: "Mindset" }
];

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
  quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}


function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  textInput.value = "";
  categoryInput.value = "";
  displayRandomQuote();
}

// Add event listeners after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
});
