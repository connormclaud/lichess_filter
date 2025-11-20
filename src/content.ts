import { createFilterButtons, injectStyles, FilterType } from './ui';
import { applyFilter } from './filters';

function init() {
    // Find the tournament list container
    const mainContainer = document.querySelector('div.arena-list.box') || document.querySelector('main');

    if (!mainContainer) {
        console.log('Lichess Filter: Main container not found');
        return;
    }

    // Inject styles
    injectStyles();

    let currentFilter: FilterType = 'all';

    // Create and inject filter buttons
    const filterContainer = createFilterButtons((type: FilterType) => {
        currentFilter = type;
        applyFilter(type);
    });

    // Determine injection point
    const upcomingContainer = document.querySelector('.tour-chart');
    const table = mainContainer.querySelector('table.slist');

    let injectionPoint: Element | null = null;

    if (upcomingContainer && upcomingContainer.parentElement) {
        injectionPoint = upcomingContainer;
    } else if (table) {
        injectionPoint = table;
    }

    if (injectionPoint && injectionPoint.parentElement) {
        injectionPoint.parentElement.insertBefore(filterContainer, injectionPoint);
        console.log('Lichess Filter: Buttons injected');
    }

    // Observer for dynamic content loading (Lichess uses websockets/SPA navigation)
    // We need two observers:
    // 1. To re-inject buttons if they disappear (navigation)
    // 2. To re-apply filter if the list content changes (updates)

    const bodyObserver = new MutationObserver(() => {
        if (!document.querySelector('.lichess-filter-group')) {
            const currentUpcoming = document.querySelector('.tour-chart');
            const currentTable = document.querySelector('table.slist');
            const target = currentUpcoming || currentTable;

            if (target && target.parentElement) {
                target.parentElement.insertBefore(filterContainer, target);
                console.log('Lichess Filter: Buttons re-injected');
                // Re-apply filter after re-injection
                applyFilter(currentFilter);
            }
        }
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Observer for list updates
    const listObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldUpdate = true;
            }
            // If Lichess removes our class, re-apply
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target as HTMLElement;
                // If we are filtering and the element should be hidden but isn't, update
                if (currentFilter !== 'all' && !target.classList.contains('lichess-filter-hidden')) {
                    shouldUpdate = true;
                }
            }
        });

        if (shouldUpdate) {
            applyFilter(currentFilter);
        }
    });

    // Observe the containers if they exist
    if (upcomingContainer) {
        // The inner container usually holds the items
        const inner = upcomingContainer.querySelector('.tour-chart__inner');
        if (inner) {
            // Observe childList for new items, and attributes (class) for existing items to prevent override
            listObserver.observe(inner, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }
    }
    if (table) {
        const tbody = table.querySelector('tbody');
        if (tbody) listObserver.observe(tbody, { childList: true });
    }
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
