import AdminResourceManager from '../../components/admin/AdminResourceManager.jsx';

const ICON_OPTIONS = ['scissors', 'lipstick', 'leaf', 'henna', 'graduationCap', 'veil'];
const SIZE_OPTIONS = [{ value: '', label: 'Normal' }, { value: 'tall', label: 'Tall' }, { value: 'wide', label: 'Wide' }];

export default function AdminGallery() {
  return (
    <AdminResourceManager
      title="Gallery"
      resourcePath="/gallery"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'photo', label: 'Photo', format: (v) => (v ? 'Yes' : 'No (icon shown)') },
        { key: 'icon', label: 'Fallback Icon' },
        { key: 'size', label: 'Masonry Size' },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'category', label: 'Category', type: 'text', required: true },
        { name: 'photo', label: 'Photo URL (leave blank to show the icon instead)', type: 'text' },
        { name: 'icon', label: 'Fallback Icon (shown if no photo, or if the photo fails to load)', type: 'select', options: ICON_OPTIONS },
        { name: 'size', label: 'Masonry Size', type: 'select', options: SIZE_OPTIONS },
      ]}
      emptyItem={{ title: '', category: '', photo: '', icon: 'leaf', size: '' }}
    />
  );
}
