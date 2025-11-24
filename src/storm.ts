function initStorm() {
    console.log('Lichess Filter: Storm script loaded');

    const findAndProcessTable = () => {
        const table = document.querySelector('table.slist');
        if (!table) return false;

        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        if (!thead || !tbody) return false;

        console.log('Lichess Filter: Table found');

        // Add Header
        const headerRow = thead.querySelector('tr');
        if (headerRow && !headerRow.querySelector('.tpm-header')) {
            const timeHeader = Array.from(headerRow.children).find(th => th.textContent?.includes('Time'));
            if (timeHeader) {
                const tpmHeader = document.createElement('th');
                tpmHeader.className = 'tpm-header';
                tpmHeader.textContent = 'Time per Move';
                tpmHeader.title = 'Time per Move';
                // Insert after Time
                headerRow.insertBefore(tpmHeader, timeHeader.nextSibling);
                console.log('Lichess Filter: Header injected');
            }
        }

        // Function to process a single row
        const processRow = (row: HTMLTableRowElement) => {
            if (row.querySelector('.tpm-cell')) return; // Already processed

            const cells = Array.from(row.children) as HTMLTableCellElement[];
            const headers = Array.from(headerRow?.children || []) as HTMLTableCellElement[];

            // Re-find indices in case they changed or to be safe
            const movesIndex = headers.findIndex(h => h.textContent?.includes('Moves'));
            const timeIndex = headers.findIndex(h => h.textContent?.includes('Time'));

            if (movesIndex === -1 || timeIndex === -1) return;

            const movesCell = cells[movesIndex];
            const timeCell = cells[timeIndex];

            if (!movesCell || !timeCell) return;

            const moves = parseInt(movesCell.textContent || '0', 10);
            const timeText = timeCell.textContent || '0';
            const time = parseInt(timeText.replace(/\D/g, ''), 10);

            let tpm = 0;
            if (moves > 0) {
                tpm = time / moves;
            }

            const tpmCell = document.createElement('td');
            tpmCell.className = 'tpm-cell';
            tpmCell.innerHTML = `<number>${tpm.toFixed(2)}</number>s`;

            // Insert after Time cell
            if (timeCell.nextSibling) {
                row.insertBefore(tpmCell, timeCell.nextSibling);
            } else {
                row.appendChild(tpmCell);
            }
        };

        // Process existing rows
        Array.from(tbody.querySelectorAll('tr')).forEach(row => processRow(row as HTMLTableRowElement));

        // Observe for new rows in tbody
        const listObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'TR') {
                            processRow(node as HTMLTableRowElement);
                        }
                    });
                }
            });
        });

        listObserver.observe(tbody, { childList: true });
        return true;
    };

    // Try to find table immediately
    if (!findAndProcessTable()) {
        console.log('Lichess Filter: Table not found immediately, observing body');
        // If not found, observe body for it
        const bodyObserver = new MutationObserver((mutations, obs) => {
            if (findAndProcessTable()) {
                obs.disconnect(); // Stop observing body once table is found
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStorm);
} else {
    initStorm();
}
