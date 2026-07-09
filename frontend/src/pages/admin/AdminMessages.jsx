import AdminListViewer from '../../components/admin/AdminListViewer.jsx';

export default function AdminMessages() {
  return (
    <AdminListViewer
      title="Contact Messages"
      resourcePath="/contact"
      statusPath={(id) => `/contact/${id}/status`}
      statusOptions={['new', 'read', 'replied']}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject' },
        { key: 'message', label: 'Message', format: (v) => (v.length > 60 ? `${v.slice(0, 60)}…` : v) },
        { key: 'status', label: 'Status' },
      ]}
    />
  );
}
