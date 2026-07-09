import AdminResourceManager from '../../components/admin/AdminResourceManager.jsx';

export default function AdminAcademyHighlights() {
  return (
    <AdminResourceManager
      title="Homepage Academy Highlights"
      resourcePath="/academy-highlights"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'detail', label: 'Detail' },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'detail', label: 'Detail', type: 'textarea', required: true },
      ]}
      emptyItem={{ title: '', detail: '' }}
    />
  );
}
