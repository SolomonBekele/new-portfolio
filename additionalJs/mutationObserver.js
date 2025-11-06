
// Select all certificate cards
const certCards = document.querySelectorAll('.certification-card');

// Helper function to log changes
function logEdit(card, property) {
  console.log(`Certificate "${card.querySelector('.certification-title')?.textContent}" edited: ${property}`);
}

// Function to attach a MutationObserver to a single card
function observeCardEdits(card) {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {

      // Detect changes in text content (title, organization, year, expiry)
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        if (mutation.target.classList?.contains('certification-title')) {
          logEdit(card, 'title');
        } else if (mutation.target.classList?.contains('certificate-organization')) {
          logEdit(card, 'organization');
        } else if (mutation.target.classList?.contains('certificate-year')) {
          logEdit(card, 'year');
        } else if (mutation.target.closest('.certificate-expiry')) {
          logEdit(card, 'expiry date');
        }
      }

      // Detect attribute changes (like data-url)
      if (mutation.type === 'attributes') {
        logEdit(card, `attribute "${mutation.attributeName}"`);
      }
    }
  });

  // Observe the card
  observer.observe(card, {
    childList: true,       // detect changes in child nodes
    subtree: true,         // monitor nested elements
    characterData: true,   // monitor text changes
    attributes: true,      // monitor attribute changes
    attributeFilter: ['data-url'], // track only the data-url attribute
  });
}

// Attach observer to all existing cards
certCards.forEach(card => observeCardEdits(card));

