import './AdminModal.css';

export default function AdminModal({ title, onClose, children }) {
  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-label={title}>
      <button className="admin-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="admin-modal__panel">
        <div className="admin-modal__header">
          <h3>{title}</h3>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  );
}
