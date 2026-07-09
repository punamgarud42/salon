import AdminResourceManager from '../../components/admin/AdminResourceManager.jsx';

const ICON_OPTIONS = ['scissors', 'lipstick', 'leaf', 'henna', 'graduationCap', 'veil'];

export default function AdminCourses() {
  return (
    <AdminResourceManager
      title="Courses"
      resourcePath="/courses"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'fee', label: 'Fee', format: (v) => `₹${v}` },
        { key: 'duration', label: 'Duration' },
        { key: 'mode', label: 'Mode' },
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'fee', label: 'Fee (₹)', type: 'number', required: true },
        { name: 'duration', label: 'Duration (display, e.g. "6 weeks")', type: 'text' },
        { name: 'mode', label: 'Mode (e.g. "Full-time", "Weekend")', type: 'text' },
        { name: 'category', label: 'Category', type: 'text', required: true },
        { name: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
        { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
      ]}
      emptyItem={{ name: '', description: '', fee: 0, duration: '', mode: '', category: '', icon: 'leaf', eligibility: '' }}
    />
  );
}
