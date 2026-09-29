import { useEffect } from 'react';

interface FeedbackModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error';
    duration?: number;
    onClose: () => void;
}


export const FeedbackModal = ({
    isOpen,
    title,
    message,
    type = 'success',
    duration = 2000,
    onClose,
}: FeedbackModalProps) => {

    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;


    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3
                    style={{
                        marginTop: 0,
                        marginBottom: '10px',
                        color: type === 'success' ? '#161A59' : '#F21D2F',
                        textAlign: 'center',
                        fontWeight: 600,
                    }}
                >
                    {title}
                </h3>

                <p
                    style={{
                        textAlign: 'center',
                        margin: 0,
                        fontSize: '15px',
                        color: '#333',
                    }}
                >
                    {message}
                </p>

            </div>
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 3000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '12px',
  width: '420px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
  textAlign: 'center',
};


