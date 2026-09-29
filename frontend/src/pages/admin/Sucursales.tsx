import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ModuleTemplate } from '../../components/templates/ModuleTemplate';
import { GenericTable } from '../../components/organisms/GenericTable';
import { ConfirmDeleteModal } from '../../components/molecules/ConfirmDeleteModal';
import { FeedbackModal } from '../../components/molecules/FeedbackModal';
import { DetailModal } from '../../components/molecules/DetailModal';
import { apiFetch } from '../../services/api/apiFetch';

interface Branch {
  idBranch?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  schedule: string;
  isActive: boolean;
  image?: string;
  imagePath?: string;
  imageUrl?: string;
  imagePreviewUrl?: string;
}

const API_BASE = 'https://localhost:7265';

const DAYS_OPTIONS = [
  { label: 'L', value: 'L' },
  { label: 'K', value: 'K' },
  { label: 'M', value: 'M' },
  { label: 'J', value: 'J' },
  { label: 'V', value: 'V' },
  { label: 'S', value: 'S' },
  { label: 'D', value: 'D' },
] as const;

const DAY_ORDER = ['L', 'K', 'M', 'J', 'V', 'S', 'D'] as const;

const DAY_NAMES: Record<(typeof DAY_ORDER)[number], string> = {
  L: 'Lunes',
  K: 'Martes',
  M: 'Miércoles',
  J: 'Jueves',
  V: 'Viernes',
  S: 'Sábado',
  D: 'Domingo',
};

const isAbsoluteUrl = (s: string) => /^https?:\/\//i.test(s);

const resolveUrl = (path?: string) => {
  if (!path) return '';
  const p = String(path).trim();
  if (!p) return '';
  if (isAbsoluteUrl(p)) return p;
  const withSlash = p.startsWith('/') ? p : `/${p}`;
  return `${API_BASE}${withSlash}`;
};

const extractFileName = (path?: string) => {
  if (!path) return '';
  const p = String(path).trim();
  if (!p) return '';
  try {
    const u = isAbsoluteUrl(p) ? new URL(p) : new URL(resolveUrl(p));
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] ?? '';
  } catch {
    const parts = p.split('/').filter(Boolean);
    return parts[parts.length - 1] ?? '';
  }
};

const getBranchImagePath = (b?: Branch | null) => {
  if (!b) return '';
  return b.imageUrl || b.imagePath || b.image || '';
};

const normalizeText = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const uniqueSortedDays = (days: string[]) => {
  const set = new Set(days.filter(d => (DAY_ORDER as readonly string[]).includes(d)));
  return DAY_ORDER.filter(d => set.has(d)) as unknown as string[];
};

const formatDaysHuman = (days: string[]) => {
  const sorted = uniqueSortedDays(days) as (typeof DAY_ORDER)[number][];
  if (sorted.length === 0) return '';
  const idx = sorted.map(d => DAY_ORDER.indexOf(d));
  const runs: number[][] = [];
  let cur: number[] = [];
  for (let i = 0; i < idx.length; i++) {
    if (cur.length === 0) {
      cur = [idx[i]];
      continue;
    }
    if (idx[i] === cur[cur.length - 1] + 1) cur.push(idx[i]);
    else {
      runs.push(cur);
      cur = [idx[i]];
    }
  }
  if (cur.length) runs.push(cur);

  const runToText = (run: number[]) => {
    const start = DAY_ORDER[run[0]];
    const end = DAY_ORDER[run[run.length - 1]];
    if (run.length === 1) return DAY_NAMES[start];
    if (run.length === 2) return `${DAY_NAMES[start]} y ${DAY_NAMES[end]}`;
    return `${DAY_NAMES[start]} a ${DAY_NAMES[end]}`;
  };

  const parts = runs.map(runToText);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} y ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`;
};

const formatSchedule = (days: string[], start: string, end: string) => {
  const d = formatDaysHuman(days);
  if (!d) return '';
  return `${d} ${start}-${end}`;
};

const getDayCodeByNameNormalized = (nameNorm: string) => {
  const map: Record<string, (typeof DAY_ORDER)[number]> = {
    lunes: 'L',
    martes: 'K',
    miercoles: 'M',
    miércoles: 'M',
    jueves: 'J',
    viernes: 'V',
    sabado: 'S',
    sábado: 'S',
    domingo: 'D',
  };
  return map[nameNorm];
};

const expandRange = (startCode: (typeof DAY_ORDER)[number], endCode: (typeof DAY_ORDER)[number]) => {
  const startIdx = DAY_ORDER.indexOf(startCode);
  const endIdx = DAY_ORDER.indexOf(endCode);
  const result: (typeof DAY_ORDER)[number][] = [];
  if (startIdx === -1 || endIdx === -1) return result;
  let i = startIdx;
  for (let guard = 0; guard < 7; guard++) {
    result.push(DAY_ORDER[i]);
    if (i === endIdx) break;
    i = (i + 1) % 7;
  }
  return result;
};

const parseSchedule = (schedule: string) => {
  const cleaned = schedule.trim().replace(/^"+|"+$/g, '');
  const timeMatch = cleaned.match(/(\d{2}:\d{2})-(\d{2}:\d{2})\s*$/);
  const startTime = timeMatch?.[1] ?? '08:00';
  const endTime = timeMatch?.[2] ?? '17:00';
  const daysText = timeMatch ? cleaned.slice(0, timeMatch.index).trim() : cleaned.trim();
  if (!daysText) return { days: [] as string[], startTime, endTime };

  const t = normalizeText(daysText)
    .replace(/\s+y\s+/g, ',')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);

  const out: string[] = [];

  for (const seg of t) {
    const rangeParts = seg.split(/\s+a\s+/).map(x => x.trim()).filter(Boolean);
    if (rangeParts.length === 2) {
      const a = getDayCodeByNameNormalized(rangeParts[0]);
      const b = getDayCodeByNameNormalized(rangeParts[1]);
      if (a && b) out.push(...expandRange(a, b));
      continue;
    }
    const single = getDayCodeByNameNormalized(seg);
    if (single) out.push(single);
  }

  return { days: uniqueSortedDays(out), startTime, endTime };
};

export const Sucursales = () => {
  const [viewBranch, setViewBranch] = useState<Branch | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');

  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  const [searchTerm, setSearchTerm] = useState('');

  const initialBranchState: Branch = {
    name: '',
    address: '',
    phone: '',
    email: '',
    schedule: '',
    isActive: true,
  };

  const [formBranch, setFormBranch] = useState<Branch>(initialBranchState);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!imagePreview) return;
    if (!imagePreview.startsWith('blob:')) return;
    return () => {
      URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const columns: { header: string; key: keyof Branch }[] = [
    { header: 'Nombre', key: 'name' },
    { header: 'Ubicación', key: 'address' },
    { header: 'Teléfono', key: 'phone' },
    { header: 'Horario', key: 'schedule' },
  ];

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/Branch`);
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImageName('');
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateAndSetImage = (file: File | null) => {
    if (!file) {
      clearImage();
      return true;
    }

    const isJpg = file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name);
    const isPng = file.type === 'image/png' || /\.png$/i.test(file.name);

    if (!isJpg && !isPng) {
      clearImage();
      setFeedbackTitle('Archivo inválido');
      setFeedbackMessage('Solo se permiten imágenes JPG o PNG.');
      setFeedbackType('error');
      setFeedbackOpen(true);
      return false;
    }

    if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImageName(file.name);
    setImagePreview(URL.createObjectURL(file));
    return true;
  };

  const saveBranch = async () => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/api/Branch/${editingId}` : '/api/Branch';

      const formData = new FormData();
      formData.append('Name', formBranch.name);
      formData.append('Address', formBranch.address);
      formData.append('Phone', formBranch.phone);
      formData.append('Email', formBranch.email);
      formData.append('Schedule', formBranch.schedule);
      formData.append('IsActive', String(formBranch.isActive));
      if (imageFile) formData.append('Image', imageFile);

      const res = await apiFetch(path, { method, body: formData });
      if (!res.ok) throw new Error(await res.text());

      closeModal();
      fetchBranches();
      setFeedbackTitle(editingId ? 'Sucursal actualizada' : 'Sucursal creada');
      setFeedbackMessage(editingId ? 'La sucursal se actualizó correctamente.' : 'La sucursal se creó correctamente.');
      setFeedbackType('success');
      setFeedbackOpen(true);
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
      setFeedbackTitle('Error');
      setFeedbackMessage('No se pudo guardar la sucursal.');
      setFeedbackType('error');
      setFeedbackOpen(true);
    }
  };

  const requestDeleteBranch = (item: Branch) => {
    setBranchToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBranch = async () => {
    if (!branchToDelete?.idBranch) return;

    try {
      const res = await apiFetch(`/api/Branch/${branchToDelete.idBranch}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());

      fetchBranches();
      setFeedbackTitle('Sucursal eliminada');
      setFeedbackMessage(`La sucursal "${branchToDelete.name}" se eliminó correctamente.`);
      setFeedbackType('success');
    } catch (error) {
      console.error('Error al eliminar sucursal:', error);
      setFeedbackTitle('Error');
      setFeedbackMessage('No se pudo eliminar la sucursal.');
      setFeedbackType('error');
    } finally {
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
      setFeedbackOpen(true);
    }
  };

  useEffect(() => {
    const finalSchedule = formatSchedule(selectedDays, startTime, endTime);
    setFormBranch(prev => ({ ...prev, schedule: finalSchedule }));
  }, [selectedDays, startTime, endTime]);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) setSelectedDays(selectedDays.filter(d => d !== day));
    else {
      const newDays = [...selectedDays, day];
      newDays.sort((a, b) => (DAY_ORDER as readonly string[]).indexOf(a) - (DAY_ORDER as readonly string[]).indexOf(b));
      setSelectedDays(newDays);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormBranch(initialBranchState);
    setSelectedDays(['L', 'K', 'M', 'J', 'V']);
    setStartTime('08:00');
    setEndTime('17:00');
    clearImage();
    setIsModalOpen(true);
  };

  const handleEdit = (item: Branch) => {
    setEditingId(item.idBranch || null);
    setFormBranch(item);

    const parsed = parseSchedule(item.schedule);
    setSelectedDays(parsed.days);
    setStartTime(parsed.startTime);
    setEndTime(parsed.endTime);

    const currentPath = getBranchImagePath(item);
    const currentUrl = resolveUrl(currentPath);
    setImageFile(null);
    setImagePreview(currentUrl);
    setImageName(extractFileName(currentPath));
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsModalOpen(true);
  };

  const handleView = (branch: Branch) => {
    const p = getBranchImagePath(branch);
    const img = resolveUrl(p);
    setViewBranch({ ...branch, imagePreviewUrl: img });
    setIsViewOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    clearImage();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formBranch.email.includes('@')) return alert('Correo inválido');
    if (formBranch.phone.length !== 8) return alert('Teléfono debe tener 8 dígitos');
    if (selectedDays.length === 0) return alert('Selecciona al menos un día de atención');
    saveBranch();
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredBranches = branches.filter((branch) => {
    const term = normalizeText(searchTerm);
    if (!term) return true;

    return (
      normalizeText(branch.name).includes(term) ||
      normalizeText(branch.address).includes(term) ||
      normalizeText(branch.phone).includes(term) ||
      normalizeText(branch.schedule).includes(term)
    );
  });

  return (
    <>
      <ModuleTemplate title="Gestión de Sucursales" buttonText="Nueva Sucursal" onAddClick={handleCreate}>
        <div style={topBarStyle}>
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Buscar sucursal por nombre, ubicación o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={clearButtonStyle}>
                Borrar
              </button>
            )}
          </div>
        </div>

        <GenericTable columns={columns} data={filteredBranches} isLoading={loading} onEdit={handleEdit} onDelete={requestDeleteBranch} onView={handleView} />
      </ModuleTemplate>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '500px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h2 style={{ color: '#161A59', marginTop: 0 }}>{editingId ? 'Editar Sucursal' : 'Nueva Sucursal'}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Nombre" required maxLength={30} value={formBranch.name} onChange={(e) => setFormBranch({ ...formBranch, name: e.target.value })} style={inputStyle} />
              <input type="text" placeholder="Ubicación" required maxLength={100} value={formBranch.address} onChange={(e) => setFormBranch({ ...formBranch, address: e.target.value })} style={inputStyle} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Teléfono" required maxLength={8} value={formBranch.phone} onChange={(e) => setFormBranch({ ...formBranch, phone: e.target.value.replace(/\D/g, '') })} style={{ ...inputStyle, flex: 1 }} />
                <input type="email" placeholder="Correo" required value={formBranch.email} onChange={(e) => setFormBranch({ ...formBranch, email: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
              </div>

              <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                <label style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>Días de Atención:</label>
                <div style={{ display: 'flex', gap: '5px', marginTop: '5px', marginBottom: '10px' }}>
                  {DAYS_OPTIONS.map((day) => {
                    const isSelected = selectedDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: isSelected ? '#161A59' : '#EEE',
                          color: isSelected ? 'white' : '#666',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: '0.2s',
                        }}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '12px', color: '#666' }}>De:</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={inputStyle} required />
                  <label style={{ fontSize: '12px', color: '#666' }}>Hasta:</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={inputStyle} required />
                </div>

                <div style={{ fontSize: '11px', color: '#999', marginTop: '5px', textAlign: 'right' }}>
                  Resultado: {formBranch.schedule}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>Imagen (JPG o PNG)</span>
                    <span style={{ fontSize: '11px', color: '#999' }}>{imageName ? imageName : 'Ninguna seleccionada'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      style={{ display: 'none' }}
                      onChange={(e) => validateAndSetImage(e.target.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        backgroundColor: '#161A59',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '13px',
                        boxShadow: '0 2px 8px rgba(22,26,89,0.25)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Elegir imagen
                    </button>
                    <button
                      type="button"
                      onClick={clearImage}
                      style={{
                        backgroundColor: 'white',
                        color: '#161A59',
                        border: '1px solid #d3d5e6',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                </div>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 170, objectFit: 'cover', borderRadius: 8, border: '1px solid #e6e6e6' }}
                    onError={() => {
                      setFeedbackTitle('Imagen no accesible');
                      setFeedbackMessage('La URL guardada existe en BD pero el servidor no la está sirviendo como estática.');
                      setFeedbackType('error');
                      setFeedbackOpen(true);
                    }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={closeModal} style={{ padding: '8px 15px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ backgroundColor: '#161A59', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        message={`¿Deseas eliminar la sucursal "${branchToDelete?.name}"?`}
        onConfirm={confirmDeleteBranch}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setBranchToDelete(null);
        }}
      />

      <FeedbackModal
        isOpen={feedbackOpen}
        title={feedbackTitle}
        message={feedbackMessage}
        type={feedbackType}
        duration={2500}
        onClose={() => setFeedbackOpen(false)}
      />

      <DetailModal
        isOpen={isViewOpen}
        title="Detalle de Sucursal"
        data={viewBranch}
        fields={[
          { label: 'Nombre', key: 'name' },
          { label: 'Dirección', key: 'address' },
          { label: 'Teléfono', key: 'phone' },
          { label: 'Correo', key: 'email' },
          { label: 'Horario', key: 'schedule' },
          { label: 'Imagen', key: 'imagePreviewUrl', format: (value) => (value ? <img src={String(value)} alt="Sucursal" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8, border: '1px solid #e6e6e6' }} /> : 'Sin imagen') },
        ]}
        onClose={() => {
          setIsViewOpen(false);
          setViewBranch(null);
        }}
      />
    </>
  );
};

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100%', boxSizing: 'border-box' as 'border-box' };

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const searchWrapperStyle = {
  position: "relative" as const,
  width: "420px",
};

const searchInputStyle = {
  width: "100%",
  padding: "12px 40px 12px 15px",
  borderRadius: "8px",
  border: "1px solid #dcdcdc",
  fontSize: "14px",
  outline: "none",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const clearButtonStyle = {
  position: "absolute" as const,
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  color: "#999",
};