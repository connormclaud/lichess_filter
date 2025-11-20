import { FilterType } from './ui';

export function applyFilter(type: FilterType) {
    const tournaments = document.querySelectorAll('table.slist tbody tr'); // Standard Lichess tournament list structure

    tournaments.forEach((row) => {
        const rowEl = row as HTMLElement;
        if (type === 'all') {
            rowEl.style.display = '';
            return;
        }

        const text = rowEl.innerText.toLowerCase();
        const icon = rowEl.querySelector('span.is'); // Icon element often contains class info
        const iconClass = icon ? icon.className.toLowerCase() : '';

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
                // If it's not standard chess (bullet/blitz/rapid/classical usually imply standard unless specified)
                // This is a simplification; variants often have specific names like "Atomic", "Crazyhouse"
                const standard = ['bullet', 'blitz', 'rapid', 'classical'];
                match = !standard.some(t => text.includes(t) || iconClass.includes(t));
                // Or explicitly check for variant names if we want to be stricter
                break;
        }

        rowEl.style.display = match ? '' : 'none';
    });
}
