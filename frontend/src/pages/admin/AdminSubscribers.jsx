import AdminListViewer from '../../components/admin/AdminListViewer.jsx';

export default function AdminSubscribers() {
  return (
    <AdminListViewer
      title="Newsletter Subscribers"
      resourcePath="/newsletter/subscribers"
      columns={[
        { key: 'email', label: 'Email' },
        { key: 'subscribedAt', label: 'Subscribed', format: (v) => new Date(v).toLocaleDateString('en-IN') },
      ]}
    />
  );
}
