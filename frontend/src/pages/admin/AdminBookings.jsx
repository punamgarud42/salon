import AdminListViewer from '../../components/admin/AdminListViewer.jsx';

export default function AdminBookings() {
  return (
    <AdminListViewer
      title="Appointments"
      resourcePath="/bookings"
      statusPath={(id) => `/bookings/${id}/status`}
      statusOptions={['confirmed', 'completed', 'cancelled']}
      columns={[
        { key: 'referenceNumber', label: 'Ref #' },
        { key: 'serviceName', label: 'Service' },
        { key: 'date', label: 'Date' },
        { key: 'timeLabel', label: 'Time' },
        { key: 'name', label: 'Client' },
        { key: 'phone', label: 'Phone' },
        { key: 'status', label: 'Status' },
      ]}
    />
  );
}
