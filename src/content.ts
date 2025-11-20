import { createFilterButtons, injectStyles, FilterType } from './ui';
import { applyFilter } from './filters';

function init() {
    // Find the tournament list container
    // Updated selector based on inspection: div.arena-list.box
    const mainContainer = document.querySelector('div.arena-list.box') || document.querySelector('main');

    if (!mainContainer) {
        console.log('Lichess Filter: Main container not found');
        return;
    }

    // Inject styles
    injectStyles();

    // Create and inject filter buttons
    const filterContainer = createFilterButtons((type: FilterType) => {
        applyFilter(type);
    });

    // Insert before the table
    const table = mainContainer.querySelector('table.slist');
    if (table && table.parentElement) {
        table.parentElement.insertBefore(filterContainer, table);
        console.log('Lichess Filter: Buttons injected');
    } else {
        console.log('Lichess Filter: Table not found');
    }

    // Observer for dynamic content loading (Lichess uses websockets/SPA navigation)
    const observer = new MutationObserver(() => {
        // Re-apply filter if new items are added, or re-inject if navigation happened
        if (!document.querySelector('.lichess-filter-group')) {
            const currentTable = document.querySelector('table.slist');
            if (currentTable && currentTable.parentElement) {
                currentTable.parentElement.insertBefore(filterContainer, currentTable);
                console.log('Lichess Filter: Buttons re-injected');
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
