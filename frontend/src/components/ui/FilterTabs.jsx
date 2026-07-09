import './FilterTabs.css';

/**
 * FilterTabs — the one category-filter control used by Services, Academy,
 * and now Gallery. Previously each page rolled its own near-identical
 * button row; consolidated here so styling/behavior changes happen once.
 */
export default function FilterTabs({ categories, active, onChange, allLabel = 'All' }) {
  return (
    <div className="filter-tabs">
      <button
        className={`filter-tabs__tab ${active === 'All' ? 'is-active' : ''}`}
        onClick={() => onChange('All')}
      >
        {allLabel}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`filter-tabs__tab ${active === cat ? 'is-active' : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
