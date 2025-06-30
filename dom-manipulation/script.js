let quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" },
  { text: "The only limit is your mind.", category: "Mindset" }
];

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
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
