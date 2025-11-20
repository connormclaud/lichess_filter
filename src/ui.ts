export type FilterType = 'all' | 'bullet' | 'blitz' | 'rapid' | 'classical' | 'variant';

export function createFilterButtons(onFilter: (type: FilterType) => void): HTMLElement {
    const container = document.createElement('div');
    container.className = 'lichess-filter-group';
    container.style.marginBottom = '1rem';
    container.style.display = 'flex';
    container.style.gap = '0.5rem';

    const filters: { label: string; type: FilterType }[] = [
        { label: 'All', type: 'all' },
        { label: 'Bullet', type: 'bullet' },
        { label: 'Blitz', type: 'blitz' },
        { label: 'Rapid', type: 'rapid' },
        { label: 'Classical', type: 'classical' },
        { label: 'Variants', type: 'variant' },
    ];

    filters.forEach(({ label, type }) => {
        const button = document.createElement('button');
        button.textContent = label;
        button.className = 'button button-empty'; // Lichess style classes
        button.style.padding = '0.5rem 1rem';
        button.style.cursor = 'pointer';

        // Add active state logic if needed, for now just simple buttons
        button.onclick = () => {
            // Update active state visual
            Array.from(container.children).forEach(c => (c as HTMLElement).classList.remove('active'));
            button.classList.add('active');
            onFilter(type);
        };

        if (type === 'all') button.classList.add('active');

        container.appendChild(button);
    });

    return container;
}

export function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
    .lichess-filter-group .button.active {
      background: #3692e7;
      color: #fff;
      border-color: #3692e7;
    }
  `;
    document.head.appendChild(style);
}
