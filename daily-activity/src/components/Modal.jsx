const Modal = ({ children, onClose }) => (
  <>
    <style>{`
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(36, 33, 26, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1000;
}

.modal {
  position: relative;
  background: var(--paper);
  width: 100%;
  max-width: 520px;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-close {
  position: absolute;
  right: 18px;
  top: 14px;
  border: none;
  background: transparent;
  font-size: 26px;
  cursor: pointer;
}
    `}</style>
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        {children}
      </div>
    </div>
  </>
);

export default Modal;