import AdminResourceManager from '../../components/admin/AdminResourceManager.jsx';

export default function AdminTestimonials() {
  return (
    <AdminResourceManager
      title="Testimonials"
      resourcePath="/testimonials"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'rating', label: 'Rating' },
        { key: 'featured', label: 'Featured', format: (v) => (v ? 'Yes' : 'No') },
      ]}
      fields={[
        { name: 'name', label: 'Client Name', type: 'text', required: true },
        { name: 'role', label: 'Role / Context (e.g. "Bridal client")', type: 'text' },
        { name: 'rating', label: 'Rating (1–5)', type: 'number', required: true },
        { name: 'quote', label: 'Quote', type: 'textarea', required: true },
        { name: 'featured', label: 'Show on homepage', type: 'checkbox' },
      ]}
      emptyItem={{ name: '', role: '', rating: 5, quote: '', featured: false }}
    />
  );
}
