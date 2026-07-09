import AdminListViewer from '../../components/admin/AdminListViewer.jsx';

export default function AdminPayments() {
  return (
    <AdminListViewer
      title="Payment History"
      resourcePath="/payments"
      columns={[
        { key: 'referenceNumber', label: 'Reference' },
        { key: 'referenceType', label: 'Type' },
        { key: 'description', label: 'For' },
        { key: 'amount', label: 'Amount', format: (v) => `₹${Number(v).toLocaleString('en-IN')}` },
        { key: 'method', label: 'Method' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Date', format: (v) => new Date(v).toLocaleString('en-IN') },
      ]}
    />
  );
}
