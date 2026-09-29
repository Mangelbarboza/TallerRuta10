import { useState, useEffect } from 'react';
import type { Employee, Branch } from '../../../types/models';
import styles from './EmployeeModal.module.css';

interface EmployeeModalProps {
    employee: Employee | null;
    branches: Branch[];
    onSave: (employee: Employee) => void;
    onClose: () => void;
    onShowError?: (message: string) => void;
}

export const EmployeeModal = ({ employee, branches, onSave, onClose, onShowError }: EmployeeModalProps) => {
    const initialState: Employee = {
        name: '',
        phoneNumber: '',
        email: '',
        position: '',
        idBranch: 0,
        isActive: true,
    };

    const [formEmployee, setFormEmployee] = useState<Employee>(employee || initialState);

    useEffect(() => {
        if (employee) {
            setFormEmployee(employee);
        }
    }, [employee]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formEmployee.name.trim()) {
            onShowError?.('El nombre es requerido');
            return;
        }

        if (formEmployee.phoneNumber.length !== 8) {
            onShowError?.('El teléfono debe tener 8 dígitos');
            return;
        }

        if (!formEmployee.email.includes('@')) {
            onShowError?.('Correo inválido');
            return;
        }

        if (!formEmployee.position.trim()) {
            onShowError?.('El puesto es requerido');
            return;
        }

        if (formEmployee.idBranch === 0) {
            onShowError?.('Selecciona una sucursal');
            return;
        }

        onSave(formEmployee);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>
                    {employee?.idEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
                </h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Nombre Completo"
                        required
                        maxLength={100}
                        value={formEmployee.name}
                        onChange={(e) => setFormEmployee({ ...formEmployee, name: e.target.value })}
                        className={styles.input}
                    />

                    <div className={styles.inputRow}>
                        <input
                            type="text"
                            placeholder="Teléfono"
                            required
                            maxLength={8}
                            value={formEmployee.phoneNumber}
                            onChange={(e) =>
                                setFormEmployee({ ...formEmployee, phoneNumber: e.target.value.replace(/\D/g, '') })
                            }
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Correo"
                            required
                            value={formEmployee.email}
                            onChange={(e) => setFormEmployee({ ...formEmployee, email: e.target.value })}
                            className={styles.input}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Puesto"
                        required
                        maxLength={100}
                        value={formEmployee.position}
                        onChange={(e) => setFormEmployee({ ...formEmployee, position: e.target.value })}
                        className={styles.input}
                    />

                    <div>
                        <label className={styles.label}>Sucursal:</label>
                        <select
                            required
                            value={formEmployee.idBranch}
                            onChange={(e) =>
                                setFormEmployee({ ...formEmployee, idBranch: Number(e.target.value) })
                            }
                            className={`${styles.input} ${styles.select}`}
                        >
                            <option value={0}>-- Selecciona una sucursal --</option>
                            {branches.map((branch) => (
                                <option key={branch.idBranch} value={branch.idBranch}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.btnCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btnSubmit}>
                            {employee?.idEmployee ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};