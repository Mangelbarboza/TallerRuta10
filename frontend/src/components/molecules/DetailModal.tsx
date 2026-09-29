import type { ReactNode } from "react";

interface FieldConfig<T> {
    label: string;
    key: keyof T;
     format?: (value: any) => ReactNode;
}

interface DetailModalProps<T> {
    isOpen: boolean;
    title: string;
    data: T | null;
    fields: FieldConfig<T>[];
    onClose: () => void;
}

export function DetailModal<T>({
    isOpen,
    title,
    data,
    fields,
    onClose
}: DetailModalProps<T>) {

    if (!isOpen || !data) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ color: "#161A59" }}>{title}</h2>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    marginTop: "20px"
                }}>
                    {fields.map((field, index) => {
                        const value = data[field.key];

                        return (
                            <div key={index}>
                                <strong>{field.label}:</strong>
                                <p>
                                    {field.format
                                        ? field.format(value)
                                        : String(value)}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: "#161A59",
                            color: "white",
                            padding: "8px 20px",
                            borderRadius: "4px",
                            border: "none"
                        }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
};

const modalStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
};