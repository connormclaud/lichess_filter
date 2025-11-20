export type FilterType = 'all' | 'bullet' | 'blitz' | 'rapid' | 'classical' | 'variant';

export function createFilterButtons(onFilter: (type: FilterType) => void, initialFilter: FilterType = 'all'): HTMLElement {
  const container = document.createElement('div');
  container.className = 'lichess-filter-group';
  container.style.marginBottom = '1rem';
  container.style.display = 'flex';
  container.style.gap = '0.5rem';

  const filters: { label: string; type: FilterType; icon?: string }[] = [
    { label: 'All', type: 'all' },
    { label: 'Bullet', type: 'bullet', icon: '' },
    { label: 'Blitz', type: 'blitz', icon: '' },
    { label: 'Rapid', type: 'rapid', icon: '' },
    { label: 'Classical', type: 'classical', icon: '' },
    { label: 'Variants', type: 'variant', icon: '' },
  ];

  filters.forEach(({ label, type, icon }) => {
    const button = document.createElement('button');
    button.className = 'button button-empty'; // Lichess style classes
    button.style.padding = '0.5rem 1rem';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.gap = '0.5rem';

    if (icon) {
      const iconSpan = document.createElement('span');
      iconSpan.setAttribute('data-icon', icon);
      button.appendChild(iconSpan);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = label;
    button.appendChild(textSpan);

    // Add active state logic if needed, for now just simple buttons
    button.onclick = () => {
      // Update active state visual
      Array.from(container.children).forEach(c => (c as HTMLElement).classList.remove('active'));
      button.classList.add('active');
      onFilter(type);
    };

    if (type === initialFilter) button.classList.add('active');

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
    .lichess-filter-hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}
