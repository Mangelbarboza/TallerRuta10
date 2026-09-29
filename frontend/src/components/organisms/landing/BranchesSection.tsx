import { useEffect, useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";


// 1. MODELO 
interface Branch {
    idBranch?: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    schedule: string;
    image?: string;
    isActive: boolean;
}

export function BranchesSection() {
    // 2. ESTADOS 
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    // 3. COMUNICACIÓN CON EL API
    const fetchBranches = async () => {
        try {
            const response = await fetch("https://localhost:7265/api/Branch");
            const data: Branch[] = await response.json();

            // SOLO sucursales activas
            const activeBranches = data.filter(b => b.isActive);
            setBranches(activeBranches);
        } catch (error) {
            console.error("Error al obtener sucursales:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    // 4. FUNCIÓN PARA ABRIR GOOGLE MAPS
    const openInMaps = (address: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            address
        )}`;
        window.open(url, "_blank");
    };


    return (
        <section id="branches" className="py-20 bg-[#F2F2F2]">
            <div className="container mx-auto px-4">
                {/* Título */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-[#161A59]">
                        Nuestras Sucursales
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Encuéntranos en nuestras diferentes ubicaciones
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="text-center text-gray-500">Cargando sucursales...</p>
                )}

                {/* Cards */}
                {!loading && (
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {branches.map((branch) => (
                            <div
                                key={branch.idBranch}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {branch.image && (
                                    <div className="h-48 w-full overflow-hidden bg-gray-100">
                                        <img
                                            src={branch.image.startsWith("http") ? branch.image : `https://localhost:7265${branch.image}`}
                                            alt={branch.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                {/* Header */}
                                <div className="bg-gradient-to-r from-[#161A59] to-[#F21D2F] p-6">
                                    <h3 className="text-xl font-bold text-white">
                                        {branch.name}
                                    </h3>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div className="flex gap-3">
                                        <div className="bg-[#F21D2F] p-2 rounded-full">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#161A59]">Dirección</p>
                                            <p className="text-gray-600">{branch.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="bg-[#161A59] p-2 rounded-full">
                                            <Phone className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#161A59]">Teléfono</p>
                                            <p className="text-gray-600">{branch.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="bg-[#F21D2F] p-2 rounded-full">
                                            <Clock className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#161A59]">Horario</p>
                                            <p className="text-gray-600">{branch.schedule}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 pb-6">
                                    <button
                                        onClick={() => openInMaps(branch.address)}
                                        className="w-full bg-[#F21D2F] text-white py-2 rounded-lg font-bold hover:bg-[#D9303E] transition-colors"
                                    >
                                        Ver en mapa →
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
