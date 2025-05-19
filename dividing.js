// dividing.js
// Dynamically add guest name input rows as the user types in the last box

document.addEventListener('DOMContentLoaded', function() {
    const guestList = document.getElementById('guest-list');

    function addNewGuestRowIfNeeded() {
        const rows = guestList.querySelectorAll('.guest-row');
        const lastRow = rows[rows.length - 1];
        const lastInput = lastRow.querySelector('.guest-name');
        function handler() {
            if (!lastRow.dataset.filled) {
                lastRow.dataset.filled = 'true';
                const newRow = document.createElement('div');
                newRow.className = 'guest-row';
                const guestNumber = guestList.querySelectorAll('.guest-row').length + 1;
                newRow.innerHTML = `<input type="text" class="guest-name" placeholder="Guest name ${guestNumber}">`;
                guestList.appendChild(newRow);
                addNewGuestRowIfNeeded();
            }
        }
        lastInput.addEventListener('input', handler, { once: true });
        // Update all placeholders
        rows.forEach((row, idx) => {
            const input = row.querySelector('.guest-name');
            input.placeholder = `Guest name ${idx + 1}`;
        });
    }

    addNewGuestRowIfNeeded();
});
