// Handles showing/hiding sections based on button clicks
const uploadBtn = document.getElementById('upload-receipt');
const manualBtn = document.getElementById('add-manually');
const uploadSection = document.getElementById('upload-section');
const manualSection = document.getElementById('manual-section');

uploadBtn.addEventListener('click', () => {
    uploadSection.style.display = 'block';
    manualSection.style.display = 'none';
});

manualBtn.addEventListener('click', () => {
    manualSection.style.display = 'block';
    uploadSection.style.display = 'none';
});

// Dynamic row addition for manual entry
const itemList = document.getElementById('item-list');

function addNewRowIfNeeded() {
    const rows = itemList.querySelectorAll('.item-row');
    const lastRow = rows[rows.length - 1];
    const lastName = lastRow.querySelector('.item-name');
    const lastPrice = lastRow.querySelector('.item-price');
    // If either input in the last row is being typed in, add a new row if not already present
    function handler() {
        if (!lastRow.dataset.filled) {
            lastRow.dataset.filled = 'true';
            const newRow = document.createElement('div');
            newRow.className = 'item-row';
            const itemNumber = itemList.querySelectorAll('.item-row').length + 1;
            newRow.innerHTML = `
                <input type="text" class="item-name" placeholder="Item name ${itemNumber}">
                <input type="number" class="item-price" placeholder="Price" min="0" step="0.01">
            `;
            itemList.appendChild(newRow);
            addNewRowIfNeeded();
        }
    }
    // Update all placeholders to be numbered correctly
    rows.forEach((row, idx) => {
        const nameInput = row.querySelector('.item-name');
        nameInput.placeholder = `Item name ${idx + 1}`;
    });
    lastName.addEventListener('input', handler, { once: true });
    lastPrice.addEventListener('input', handler, { once: true });
}

addNewRowIfNeeded();

// Collects manual entry data into a dictionary
function getManualItemsDictionary() {
    const rows = itemList.querySelectorAll('.item-row');
    const itemsDict = {};
    rows.forEach(row => {
        const name = row.querySelector('.item-name').value.trim();
        const price = parseFloat(row.querySelector('.item-price').value);
        if (name && !isNaN(price)) {
            itemsDict[name] = price;
        }
    });
    return itemsDict;
}

// Example: Add a button to test dictionary output
const manualForm = document.getElementById('manual-form');
const submitBtn = document.createElement('button');
submitBtn.type = 'button';
submitBtn.textContent = 'Done';
submitBtn.style.marginTop = '20px';
submitBtn.className = 'small-green-btn';
submitBtn.style.marginLeft = '0';
submitBtn.style.display = 'inline-block';
manualForm.appendChild(submitBtn);

submitBtn.addEventListener('click', () => {
    // Always save the latest values to dictionary on every click
    window.latestItemsDict = getManualItemsDictionary();
    console.log('Items dictionary:', window.latestItemsDict);
    // Show tip input box after saving items
    showTipInputBox(window.latestItemsDict);
});

function showTipInputBox(itemsDict) {
    // Prevent multiple tip boxes
    if (document.getElementById('tip-input-row')) return;
    const tipRow = document.createElement('div');
    tipRow.id = 'tip-input-row';
    tipRow.style.marginTop = '24px';
    tipRow.innerHTML = `
        <div class="tip-calc-row">
            <label for="tip-type">Tip Type:</label>
            <select id="tip-type">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
            </select>
        </div>
        <div class="tip-calc-row">
            <label for="tip-input" id="tip-label">Tip Amount (%): </label>
            <input type="number" id="tip-input" min="0" step="0.01" placeholder="Enter tip percentage">
        </div>
        <div class="tip-calc-row">
            <button id="tip-done-btn" type="button" class="green-btn" style="margin-top:8px;">Calculate</button>
        </div>
    `;
    manualForm.appendChild(tipRow);

    const tipType = document.getElementById('tip-type');
    const tipInput = document.getElementById('tip-input');
    const tipLabel = document.getElementById('tip-label');

    tipType.addEventListener('change', () => {
        if (tipType.value === 'percent') {
            tipLabel.textContent = 'Tip Amount (%): ';
            tipInput.placeholder = 'Enter tip percentage';
        } else {
            tipLabel.textContent = 'Tip Amount ($): ';
            tipInput.placeholder = 'Enter tip amount';
        }
    });

    document.getElementById('tip-done-btn').addEventListener('click', () => {
        const tipValue = parseFloat(tipInput.value);
        if (isNaN(tipValue) || tipValue < 0) {
            alert('Please enter a valid tip.');
            return;
        }
        const total = Object.values(window.latestItemsDict).reduce((sum, val) => sum + val, 0);
        let tipAmount = 0;
        if (tipType.value === 'percent') {
            tipAmount = total * (tipValue / 100);
        } else {
            tipAmount = tipValue;
        }
        // Display the total tip amount, tax, subtotal, and total bill
        let tipResult = document.getElementById('tip-result');
        if (!tipResult) {
            tipResult = document.createElement('div');
            tipResult.id = 'tip-result';
            tipResult.style.marginTop = '16px';
            manualForm.appendChild(tipResult);
        }
        // Calculate tax, subtotal, and total
        const taxAmount = total * 0.07;
        const subtotal = total;
        const grandTotal = subtotal + taxAmount + tipAmount;
        tipResult.innerHTML = `
            <div class="ticket-summary">
                <div><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</div>
                <div><strong>Tax (7%):</strong> $${taxAmount.toFixed(2)}</div>
                <div><strong>Total tip for the bill:</strong> $${tipAmount.toFixed(2)}</div>
                <div style="margin-top:8px;"><strong>Total Bill:</strong> $${grandTotal.toFixed(2)}</div>
            </div>
            <button id="final-confirm-btn" type="button" class="green-btn" style="margin-top:24px;width:100%;font-size:1.2rem;padding:16px 0;">Everything looks good</button>
        `;
        // Optionally, add event listener for the button here
        const finalBtn = document.getElementById('final-confirm-btn');
        finalBtn.addEventListener('click', () => {
            // Save all values to localStorage before navigating
            localStorage.setItem('billSplitter_itemsDict', JSON.stringify(window.latestItemsDict));
            localStorage.setItem('billSplitter_tipType', tipType.value);
            localStorage.setItem('billSplitter_tipValue', tipInput.value);
            localStorage.setItem('billSplitter_taxRate', '0.07');
            localStorage.setItem('billSplitter_total', grandTotal.toFixed(2));
            window.location.href = 'dividing.html';
        });
        console.log('Total tip amount:', tipAmount);
    });
}

function getSubtotalBill(){
    let total = 0;
    for(item in itemsDict){
        total += itemsDict[item];
    }
    return total;
}

function getTaxBill(){
    let total = getSubtotalBill();
    let tax = total * 0.07; // Assuming a 7% tax rate
    return tax;
}

function getTotalBill(){
    let total = getSubtotalBill() + getTaxBill();
    return total;
}

