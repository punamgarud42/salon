import AdminListViewer from '../../components/admin/AdminListViewer.jsx';

export default function AdminEnrollments() {
  return (
    <AdminListViewer
      title="Academy Applications"
      resourcePath="/enrollments"
      statusPath={(id) => `/enrollments/${id}/status`}
      statusOptions={['confirmed', 'completed', 'cancelled']}
      columns={[
        { key: 'referenceNumber', label: 'Ref #' },
        { key: 'courseName', label: 'Course' },
        { key: 'batchLabel', label: 'Batch' },
        { key: 'name', label: 'Applicant' },
        { key: 'phone', label: 'Phone' },
        { key: 'age', label: 'Age' },
        { key: 'status', label: 'Status' },
      ]}
    />
  );
}
