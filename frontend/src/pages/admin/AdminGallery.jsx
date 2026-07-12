import AdminResourceManager from '../../components/admin/AdminResourceManager.jsx';

const ICON_OPTIONS = ['scissors', 'lipstick', 'leaf', 'henna', 'graduationCap', 'veil'];
const SIZE_OPTIONS = [{ value: '', label: 'Normal' }, { value: 'tall', label: 'Tall' }, { value: 'wide', label: 'Wide' }];
const MEDIA_OPTIONS = [
  { value: 'icon', label: 'Icon (no photo/video yet)' },
  { value: 'image', label: 'Photo' },
  { value: 'video', label: 'Video' },
];

export default function AdminGallery() {
  return (
    <AdminResourceManager
      title="Gallery"
      resourcePath="/gallery"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'mediaType', label: 'Media', format: (v) => v === 'video' ? '🎬 Video' : v === 'image' ? '📷 Photo' : '🎨 Icon' },
        { key: 'size', label: 'Masonry Size' },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'category', label: 'Category (Hair, Makeup, Skin, Mehendi, Bridal, Academy)', type: 'text', required: true },
        { name: 'mediaType', label: 'Media Type', type: 'select', options: MEDIA_OPTIONS },
        { name: 'photo', label: 'Photo — upload an image (only used when Media Type is "Photo")', type: 'image' },
        { name: 'video', label: 'Video — upload a video clip (only used when Media Type is "Video")', type: 'video' },
        { name: 'icon', label: 'Fallback Icon — shown when no photo or video is uploaded', type: 'select', options: ICON_OPTIONS },
        { name: 'size', label: 'Masonry Size', type: 'select', options: SIZE_OPTIONS },
      ]}
      emptyItem={{ title: '', category: '', mediaType: 'icon', photo: '', video: '', icon: 'leaf', size: '' }}
    />
  );
}
