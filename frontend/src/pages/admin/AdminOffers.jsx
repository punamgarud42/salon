import AdminResourceManager from '../../components/admin/AdminResourceManager.jsx';

/** Converts an ISO date string to the "YYYY-MM-DDTHH:mm" format datetime-local inputs expect. */
function toDatetimeLocal(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminOffers() {
  return (
    <AdminResourceManager
      title="Offers"
      resourcePath="/offers"
      prepareForEdit={(item) => ({ ...item, endsAt: toDatetimeLocal(item.endsAt) })}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'discountLabel', label: 'Discount' },
        { key: 'code', label: 'Code' },
        { key: 'category', label: 'Category' },
        { key: 'endsAt', label: 'Ends At', format: (v) => new Date(v).toLocaleString('en-IN') },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'discountLabel', label: 'Discount Label (e.g. "20% OFF")', type: 'text', required: true },
        { name: 'code', label: 'Promo Code', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'text', required: true },
        { name: 'endsAt', label: 'Ends At', type: 'date', datetime: true, required: true },
      ]}
      emptyItem={{ title: '', description: '', discountLabel: '', code: '', category: '', endsAt: '' }}
    />
  );
}
