import AdminResourceManager from '../../components/admin/AdminResourceManager.jsx';

const ICON_OPTIONS = ['scissors', 'lipstick', 'leaf', 'henna', 'graduationCap', 'veil'];

export default function AdminServices() {
  return (
    <AdminResourceManager
      title="Services"
      resourcePath="/services"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price', format: (v) => `₹${v}` },
        { key: 'duration', label: 'Duration' },
        { key: 'featured', label: 'Featured', format: (v) => (v ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'photo', label: 'Service Photo', type: 'image' },
        { name: 'price', label: 'Price (₹)', type: 'number', required: true },
        { name: 'duration', label: 'Duration (display, e.g. "45 min")', type: 'text' },
        { name: 'durationMinutes', label: 'Duration (minutes, used for booking slots)', type: 'number', required: true },
        { name: 'category', label: 'Category', type: 'text', required: true },
        { name: 'icon', label: 'Fallback Icon (shown if no photo)', type: 'select', options: ICON_OPTIONS },
        { name: 'featured', label: 'Show on homepage', type: 'checkbox' },
      ]}
      emptyItem={{ name: '', description: '', photo: '', price: 0, duration: '', durationMinutes: 30, category: '', icon: 'leaf', featured: false }}
    />
  );
}
