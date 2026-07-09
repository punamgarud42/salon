import './AdminForm.css';

/**
 * AdminForm — renders a set of fields from a config array and calls
 * onSubmit(values) when saved. Every resource manager (services, courses,
 * gallery, testimonials, offers, academy highlights, batches) uses this
 * same renderer with a different `fields` config, rather than each having
 * its own hand-built form.
 *
 * Field shape: { name, label, type: 'text'|'textarea'|'number'|'select'|'checkbox'|'date', options?, required? }
 */
export default function AdminForm({ fields, values, onChange, onSubmit, onCancel, saving, error }) {
  function handleFieldChange(name, value) {
    onChange({ ...values, [name]: value });
  }

  return (
    <form
      className="admin-form"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    >
      {fields.map((field) => (
        <div className="admin-form__field" key={field.name}>
          <label className="admin-form__label" htmlFor={field.name}>{field.label}</label>

          {field.type === 'textarea' && (
            <textarea
              id={field.name}
              className="admin-form__textarea"
              rows={3}
              value={values[field.name] ?? ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
            />
          )}

          {field.type === 'select' && (
            <select
              id={field.name}
              className="admin-form__input"
              value={values[field.name] ?? ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
            >
              {field.options.map((opt) => {
                const value = typeof opt === 'object' ? opt.value : opt;
                const label = typeof opt === 'object' ? opt.label : opt;
                return <option key={value} value={value}>{label}</option>;
              })}
            </select>
          )}

          {field.type === 'checkbox' && (
            <input
              id={field.name}
              type="checkbox"
              checked={!!values[field.name]}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            />
          )}

          {field.type === 'number' && (
            <input
              id={field.name}
              type="number"
              className="admin-form__input"
              value={values[field.name] ?? ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value === '' ? '' : Number(e.target.value))}
              required={field.required}
            />
          )}

          {field.type === 'date' && (
            <input
              id={field.name}
              type={field.datetime ? 'datetime-local' : 'date'}
              className="admin-form__input"
              value={values[field.name] ?? ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
            />
          )}

          {(!field.type || field.type === 'text') && (
            <input
              id={field.name}
              type="text"
              className="admin-form__input"
              value={values[field.name] ?? ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
        </div>
      ))}

      {error && <p className="admin-form__error">{error}</p>}

      <div className="admin-form__actions">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
