import { FilterType } from './ui';

export function applyFilter(type: FilterType) {
    // Select both finished tournaments (table rows) and upcoming tournaments (links in tour-chart)
    const rows = document.querySelectorAll('table.slist tbody tr');
    const upcoming = document.querySelectorAll('.tour-chart__inner a');

    const filterElement = (el: HTMLElement, text: string, iconClass: string) => {
        if (type === 'all') {
            el.classList.remove('lichess-filter-hidden');
            return;
        }

        let match = false;
        switch (type) {
            case 'bullet':
                match = text.includes('bullet') || iconClass.includes('bullet');
                break;
            case 'blitz':
                match = text.includes('blitz') || iconClass.includes('blitz');
                break;
            case 'rapid':
                match = text.includes('rapid') || iconClass.includes('rapid');
                break;
            case 'classical':
                match = text.includes('classical') || iconClass.includes('classical');
                break;
            case 'variant':
                const standard = ['bullet', 'blitz', 'rapid', 'classical'];
                match = !standard.some(t => text.includes(t) || iconClass.includes(t));
                break;
        }

        if (match) {
            el.classList.remove('lichess-filter-hidden');
        } else {
            el.classList.add('lichess-filter-hidden');
        }
    };

    // Filter table rows
    rows.forEach((row) => {
        const rowEl = row as HTMLElement;
        const text = rowEl.innerText.toLowerCase();
        const icon = rowEl.querySelector('span.is');
        const iconClass = icon ? icon.className.toLowerCase() : '';
        filterElement(rowEl, text, iconClass);
    });

    // Filter upcoming tournaments
    upcoming.forEach((item) => {
        const itemEl = item as HTMLElement;
        const text = itemEl.innerText.toLowerCase();
        // Upcoming items often have an icon with data-icon or class
        // Based on inspection, they might have span.icon
        const icon = itemEl.querySelector('span.icon');
        // Also check the element's own class or data attributes if needed
        // For now, text content + icon class should cover most
        const iconClass = icon ? (icon.className + ' ' + (icon.getAttribute('data-icon') || '')).toLowerCase() : '';

        filterElement(itemEl, text, iconClass);
    });
}
