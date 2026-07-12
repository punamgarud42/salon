import AdminResourceManager from '../../components/admin/AdminResourceManager.jsx';

export default function AdminBeforeAfter() {
  return (
    <AdminResourceManager
      title="Before & After Photos"
      resourcePath="/before-after"
      columns={[
        { key: 'category', label: 'Category' },
        { key: 'label', label: 'Label' },
        { key: 'beforePhoto', label: 'Before', format: (v) => (v ? '✓ Photo' : '— Not uploaded') },
        { key: 'afterPhoto', label: 'After', format: (v) => (v ? '✓ Photo' : '— Not uploaded') },
        { key: 'active', label: 'Visible', format: (v) => (v ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'category', label: 'Category (e.g. Hair, Makeup, Skin, Mehendi)', type: 'text', required: true },
        { name: 'label', label: 'Caption shown below the slider', type: 'text', required: true },
        { name: 'beforePhoto', label: 'Before Photo — upload a real client photo (with their consent)', type: 'image' },
        { name: 'afterPhoto', label: 'After Photo — upload the matching result photo', type: 'image' },
        { name: 'active', label: 'Show on gallery page', type: 'checkbox' },
      ]}
      emptyItem={{ category: '', label: '', beforePhoto: '', afterPhoto: '', active: true }}
    />
  );
}
