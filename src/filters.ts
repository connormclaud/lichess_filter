import { FilterType } from './ui';

export function applyFilter(type: FilterType) {
    // Select both finished tournaments (table rows) and upcoming tournaments (links in tour-chart)
    const rows = document.querySelectorAll('table.slist tbody tr');
    const upcoming = document.querySelectorAll('.tour-chart__inner a');

    const filterElement = (el: HTMLElement, text: string, iconData: string) => {
        if (type === 'all') {
            el.classList.remove('lichess-filter-hidden');
            return;
        }

        let match = false;

        switch (type) {
            case 'bullet':
                match = text.includes('bullet') || iconData.includes('bullet');
                break;
            case 'blitz':
                match = text.includes('blitz') || iconData.includes('blitz');
                break;
            case 'rapid':
                match = text.includes('rapid') || iconData.includes('rapid');
                break;
            case 'classical':
                match = text.includes('classical') || iconData.includes('classical');
                break;
            case 'variant':
                const standard = ['bullet', 'blitz', 'rapid', 'classical'];
                match = !standard.some(t => text.includes(t) || iconData.includes(t));
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
        // Combine class and title for checking (user requested to check icon title)
        const iconData = icon ? (
            icon.className + ' ' +
            (icon.getAttribute('title') || '')
        ).toLowerCase() : '';

        filterElement(rowEl, text, iconData);
    });

    // Filter upcoming tournaments
    upcoming.forEach((item) => {
        const itemEl = item as HTMLElement;
        const text = itemEl.innerText.toLowerCase();
        const icon = itemEl.querySelector('span.icon');

        const iconData = icon ? (
            icon.className + ' ' +
            (icon.getAttribute('title') || '')
        ).toLowerCase() : '';

        filterElement(itemEl, text, iconData);
    });
}
