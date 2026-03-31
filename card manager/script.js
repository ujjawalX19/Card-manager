const cardsContainer = document.getElementById('cardsContainer');
const createCardBtn = document.getElementById('createCardBtn');

// State holding all created cards
let cards = [];

function getCardDetailsFromUser() {
    const number = prompt("Enter 16-digit Card Number (e.g. 1234 5678 1234 5678):", "1234 5678 1234 5678");
    if (!number) return null;
    
    const expiry = prompt("Enter Expiry Date (MM/YY):", "12/26");
    if (!expiry) return null;
    
    const cvv = prompt("Enter 3-digit CVV:", "123");
    if (!cvv) return null;
    
    return {
        id: Date.now(),
        number: number,
        expiry: expiry,
        cvv: cvv,
        isBlocked: false,
        isRevealed: false
    };
}

function init() {
    // Start empty, user will add cards
    renderCards();
    updateCreateBtnState();
}

function updateCreateBtnState() {
    // Button is always enabled to allow adding more cards
    createCardBtn.disabled = false;
}

function renderCards() {
    cardsContainer.innerHTML = '';
    cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = `credit-card ${card.isBlocked ? 'blocked' : ''}`;
        
        // Default text when hidden
        const hiddenNumber = '•••• •••• •••• ••••';
        const hiddenExpiry = '••/••';
        const hiddenCvv = '•••';

        const numberDisplay = card.isRevealed ? card.number : hiddenNumber;
        const expiryDisplay = card.isRevealed ? card.expiry : hiddenExpiry;
        const cvvDisplay = card.isRevealed ? card.cvv : hiddenCvv;
        
        const actionsHtml = `
            <div class="card-actions">
                <button class="btn btn-outline" onclick="toggleReveal(${card.id})">
                    ${card.isRevealed ? 'Hide Details' : 'Show Details'}
                </button>
                ${!card.isBlocked ? `<button class="btn btn-danger" onclick="blockCard(${card.id})">Block Card</button>` : ''}
            </div>
        `;

        cardEl.innerHTML = `
            <div class="card-header">
                <span class="bank-name">TrustBank</span>
                <span class="status-badge ${card.isBlocked ? 'status-blocked' : 'status-active'}">
                    ${card.isBlocked ? 'Blocked' : 'Active'}
                </span>
            </div>
            <div class="card-chip"></div>
            <div class="card-number">${numberDisplay}</div>
            <div class="card-details">
                <div class="detail-group">
                    <span class="label">Expiry</span>
                    <span class="value">${expiryDisplay}</span>
                </div>
                <div class="detail-group">
                    <span class="label">CVV</span>
                    <span class="value">${cvvDisplay}</span>
                </div>
            </div>
            ${actionsHtml}
        `;
        cardsContainer.appendChild(cardEl);
    });
}

// Global functions so they can be accessed from inline onclick handlers
window.toggleReveal = function(id) {
    const card = cards.find(c => c.id === id);
    if (card) {
        card.isRevealed = !card.isRevealed;
        renderCards();
    }
}

window.blockCard = function(id) {
    const card = cards.find(c => c.id === id);
    // Once the card is blocked it can't be unblocked
    if (card && !card.isBlocked) {
        if(confirm("Are you sure you want to block this card? This action cannot be undone.")) {
            card.isBlocked = true;
            card.isRevealed = false; // Optionally hide details on block
            renderCards();
            updateCreateBtnState();
        }
    }
}

createCardBtn.addEventListener('click', () => {
    const newCard = getCardDetailsFromUser();
    if (newCard) {
        const duplicateCard = cards.find(card => 
            card.number === newCard.number && 
            card.expiry === newCard.expiry && 
            card.cvv === newCard.cvv
        );

        if (duplicateCard) {
            if (duplicateCard.isBlocked) {
                alert("This card has been blocked and cannot be added again.");
            } else {
                alert("This card has already been added.");
            }
            return;
        }

        cards.unshift(newCard);
        renderCards();
        updateCreateBtnState();
    }
});

// Run
init();
