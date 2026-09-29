using Microsoft.EntityFrameworkCore;
using Taller_back.Domain;

namespace Taller_back.Infraestructure
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

            await context.Database.EnsureCreatedAsync();

            try
            {
                _ = await context.Admins.AnyAsync();
                _ = await context.BranchProducts.AnyAsync();
                _ = await context.Products.Select(p => p.IdOffer).FirstOrDefaultAsync();
                _ = await context.Services.Select(s => s.IdOffer).FirstOrDefaultAsync();
                _ = await context.Appointments.Select(a => a.ClientWasCreatedHere).FirstOrDefaultAsync();
            }
            catch
            {
                await context.Database.EnsureDeletedAsync();
                await context.Database.EnsureCreatedAsync();
            }

            var today = DateTime.Today;

            if (!await context.Admins.AnyAsync())
            {
                context.Admins.AddRange(
                    new Admin
                    {
                        Name = "admin",
                        Email = "admin@tallerruta10.com",
                        Password = "Admin123!"
                    },
                    new Admin
                    {
                        Name = "Leo Cortés",
                        Email = "leo@tallerruta10.com",
                        Password = "123456"
                    }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.Branches.AnyAsync())
            {
                var branch1 = new Branch
                {
                    Name = "Sede Central Turrialba",
                    Address = "Ruta Nacional 10, 200m Este del Estadio Rafael Ángel Camacho, Turrialba",
                    Phone = "25564810",
                    Email = "central@tallerruta10.com",
                    Schedule = "Lunes a Sábado 08:00-17:00",
                    Image = "/uploads/photos/sucursales/3e40e01e-e07e-4b89-8ca0-e24dc35e224b.png",
                    IsActive = true
                };

                var branch2 = new Branch
                {
                    Name = "Sucursal Las Américas",
                    Address = "Barrio Las Américas, frente a Plaza Comercial Turrialba, Cartago",
                    Phone = "25568920",
                    Email = "lasamericas@tallerruta10.com",
                    Schedule = "Lunes a Sábado 08:00-17:00",
                    Image = "/uploads/photos/sucursales/47a984db-9e8b-45ae-8b29-fcdfa32ee2f0.png",
                    IsActive = true
                };

                context.Branches.AddRange(branch1, branch2);
                await context.SaveChangesAsync();
            }

            if (!await context.Suppliers.AnyAsync())
            {
                context.Suppliers.AddRange(
                    new Supplier
                    {
                        Name = "Purdy Repuestos Automotrices",
                        Phone = "22579010",
                        Email = "ventas@purdyrepuestos.co.cr",
                        Manager = "Carlos Alvarado Rojas",
                        IsActive = true
                    },
                    new Supplier
                    {
                        Name = "Importadora de Lubricantes y Baterías CR",
                        Phone = "22324450",
                        Email = "pedidos@lubricantescr.com",
                        Manager = "Andrea Jiménez Solís",
                        IsActive = true
                    },
                    new Supplier
                    {
                        Name = "Llantas y Frenos del Atlántico S.A.",
                        Phone = "25563190",
                        Email = "contacto@llantasatlantico.cr",
                        Manager = "Roberto Solano Brenes",
                        IsActive = true
                    }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.Offers.AnyAsync())
            {
                context.Offers.AddRange(
                    new Offer
                    {
                        StartDate = today.AddDays(-2),
                        EndDate = today.AddDays(7),
                        Discount = 15m,
                        IsActive = true
                    },
                    new Offer
                    {
                        StartDate = today.AddDays(-1),
                        EndDate = today.AddDays(12),
                        Discount = 10m,
                        IsActive = true
                    },
                    new Offer
                    {
                        StartDate = today,
                        EndDate = today.AddDays(25),
                        Discount = 20m,
                        IsActive = true
                    }
                );
                await context.SaveChangesAsync();
            }

            var branches = await context.Branches.OrderBy(b => b.IdBranch).ToListAsync();
            var suppliers = await context.Suppliers.OrderBy(s => s.IdSupplier).ToListAsync();
            var offers = await context.Offers.OrderBy(o => o.IdOffer).ToListAsync();

            if (!await context.Products.AnyAsync() && branches.Count >= 2 && suppliers.Count >= 3 && offers.Count >= 3)
            {
                var products = new List<Product>
                {
                    new Product
                    {
                        Name = "Aceite Pennzoil 20W-50 Motor Oil (Galón)",
                        Description = "Lubricante multigrado de alta protección contra el desgaste térmico y depósitos en motores gasolina de alto kilometraje.",
                        SalePrice = 18500m,
                        IdSupplier = suppliers[1].IdSupplier,
                        IdOffer = offers[0].IdOffer,
                        Image = "/uploads/photos/productos/0ba795b7-9bab-40d3-93b6-4ea4814cef4c.png",
                        IsActive = true
                    },
                    new Product
                    {
                        Name = "Aceite SuperTech 20W-50 Semi-Sintético",
                        Description = "Aceite multigrado semi-sintético formulado para brindar arranque suave y limpieza continua del motor.",
                        SalePrice = 14900m,
                        IdSupplier = suppliers[1].IdSupplier,
                        IdOffer = null,
                        Image = "/uploads/photos/productos/01c0b93e-83da-4088-b938-9fd6d3cb2362.jpg",
                        IsActive = true
                    },
                    new Product
                    {
                        Name = "Batería Interstate MTP-27F 12V 800 CCA",
                        Description = "Batería libre de mantenimiento de alto amperaje de arranque en frío, ideal para sedanes, SUVs y pick-ups 4x4.",
                        SalePrice = 74500m,
                        IdSupplier = suppliers[1].IdSupplier,
                        IdOffer = offers[1].IdOffer,
                        Image = "/uploads/photos/productos/a24b0abe-ac4f-4061-8188-f6f02661a751.png",
                        IsActive = true
                    },
                    new Product
                    {
                        Name = "Juego de Llantas Deportivas All-Season R17",
                        Description = "Set de neumáticos radiales con compuesto de sílice de alta adherencia en piso mojado y excelente durabilidad.",
                        SalePrice = 210000m,
                        IdSupplier = suppliers[2].IdSupplier,
                        IdOffer = offers[2].IdOffer,
                        Image = "/uploads/photos/productos/f3aa46fe-39f1-47b4-ac69-0744bbc06732.png",
                        IsActive = true
                    },
                    new Product
                    {
                        Name = "Kit de Pastillas Cerámicas de Freno Delanteras",
                        Description = "Pastillas cerámicas de frenado silencioso, baja emisión de polvo y alta resistencia a la fatiga térmica.",
                        SalePrice = 34500m,
                        IdSupplier = suppliers[2].IdSupplier,
                        IdOffer = offers[0].IdOffer,
                        Image = "/uploads/photos/productos/pastillas-brembo.svg",
                        IsActive = true
                    },
                    new Product
                    {
                        Name = "Kit de Filtros de Aceite y Aire Bosch Premium",
                        Description = "Paquete de filtración sintética de alta eficiencia que retiene hasta el 99% de micropartículas abrasivas.",
                        SalePrice = 15800m,
                        IdSupplier = suppliers[0].IdSupplier,
                        IdOffer = null,
                        Image = "/uploads/photos/productos/filtro-bosch.svg",
                        IsActive = true
                    }
                };

                context.Products.AddRange(products);
                await context.SaveChangesAsync();

                foreach (var prod in products)
                {
                    context.BranchProducts.Add(new BranchProduct
                    {
                        IdBranch = branches[0].IdBranch,
                        IdProduct = prod.IdProduct,
                        Stock = 18
                    });
                    context.BranchProducts.Add(new BranchProduct
                    {
                        IdBranch = branches[1].IdBranch,
                        IdProduct = prod.IdProduct,
                        Stock = 12
                    });
                }
                await context.SaveChangesAsync();
            }

            if (!await context.Services.AnyAsync() && branches.Count >= 2 && offers.Count >= 3)
            {
                var services = new List<Service>
                {
                    new Service
                    {
                        Name = "Cambio de Aceite y Filtro Completo",
                        Description = "Reemplazo de aceite de motor, cambio de filtro, revisión de niveles de fluidos y chequeo multipunto de seguridad.",
                        BasePrice = 26500m,
                        IdOffer = offers[0].IdOffer,
                        IsActive = true
                    },
                    new Service
                    {
                        Name = "Diagnóstico Computarizado OBD-II",
                        Description = "Escaneo electrónico completo de sensores, motor, transmisión, ABS y lectura de códigos de falla en tiempo real.",
                        BasePrice = 18000m,
                        IdOffer = null,
                        IsActive = true
                    },
                    new Service
                    {
                        Name = "Alineado y Balanceo Computarizado 3D",
                        Description = "Ajuste de ángulos de camber, caster y convergencia junto con balanceo dinámico en las cuatro ruedas.",
                        BasePrice = 24000m,
                        IdOffer = offers[1].IdOffer,
                        IsActive = true
                    },
                    new Service
                    {
                        Name = "Mantenimiento Integral de Frenos",
                        Description = "Inspección y limpieza de mordazas, rectificación o cambio de pastillas, purgado y ajuste de freno de mano.",
                        BasePrice = 32000m,
                        IdOffer = null,
                        IsActive = true
                    },
                    new Service
                    {
                        Name = "Afinamiento Completo e Inyectores",
                        Description = "Limpieza ultrasónica de inyectores, cambio de bujías, filtros de aire/combustible y calibración de cuerpo de aceleración.",
                        BasePrice = 48000m,
                        IdOffer = offers[2].IdOffer,
                        IsActive = true
                    },
                    new Service
                    {
                        Name = "Revisión de Sistema Eléctrico y Batería",
                        Description = "Prueba de carga de alternador, motor de arranque, estado de batería y revisión de fusibles y luces.",
                        BasePrice = 15000m,
                        IdOffer = null,
                        IsActive = true
                    }
                };

                context.Services.AddRange(services);
                await context.SaveChangesAsync();

                foreach (var srv in services)
                {
                    context.BranchServices.Add(new BranchService
                    {
                        IdBranch = branches[0].IdBranch,
                        IdService = srv.IdService
                    });
                    context.BranchServices.Add(new BranchService
                    {
                        IdBranch = branches[1].IdBranch,
                        IdService = srv.IdService
                    });
                }
                await context.SaveChangesAsync();
            }

            if (!await context.Employee.AnyAsync() && branches.Count >= 2)
            {
                context.Employee.AddRange(
                    new Employee
                    {
                        Name = "Esteban Mora Quesada",
                        PhoneNumber = "88451290",
                        Email = "esteban.mora@tallerruta10.com",
                        Position = "Jefe de Taller Mecánico",
                        IdBranch = branches[0].IdBranch,
                        IsActive = true
                    },
                    new Employee
                    {
                        Name = "Mauricio Camacho Vega",
                        PhoneNumber = "87126534",
                        Email = "mauricio.camacho@tallerruta10.com",
                        Position = "Especialista en Diagnóstico y Electrónica",
                        IdBranch = branches[0].IdBranch,
                        IsActive = true
                    },
                    new Employee
                    {
                        Name = "Daniela Rojas Monge",
                        PhoneNumber = "83904411",
                        Email = "daniela.rojas@tallerruta10.com",
                        Position = "Asesora de Servicio al Cliente",
                        IdBranch = branches[0].IdBranch,
                        IsActive = true
                    },
                    new Employee
                    {
                        Name = "Kenneth Araya Solano",
                        PhoneNumber = "86219870",
                        Email = "kenneth.araya@tallerruta10.com",
                        Position = "Técnico en Frenos y Suspensión",
                        IdBranch = branches[1].IdBranch,
                        IsActive = true
                    },
                    new Employee
                    {
                        Name = "Valeria Quirós Castro",
                        PhoneNumber = "85103322",
                        Email = "valeria.quiros@tallerruta10.com",
                        Position = "Encargada de Sucursal y Repuestos",
                        IdBranch = branches[1].IdBranch,
                        IsActive = true
                    }
                );
                await context.SaveChangesAsync();
            }

            var serviceList = await context.Services.OrderBy(s => s.IdService).ToListAsync();

            if (!await context.Clients.AnyAsync() && branches.Count >= 2 && serviceList.Count >= 5)
            {
                var clients = new List<Client>
                {
                    new Client
                    {
                        Name = "Alejandro",
                        LastName = "Méndez Vargas",
                        Phone = "88112233",
                        Email = "alejandro.mendez@gmail.com",
                        WithAppointment = true,
                        IsActive = true
                    },
                    new Client
                    {
                        Name = "Mariana",
                        LastName = "Fernández Castro",
                        Phone = "87223344",
                        Email = "mariana.fernandez@outlook.com",
                        WithAppointment = true,
                        IsActive = true
                    },
                    new Client
                    {
                        Name = "Gabriel",
                        LastName = "Chinchilla Mora",
                        Phone = "83445566",
                        Email = "gabriel.chinchilla@gmail.com",
                        WithAppointment = false,
                        IsActive = true
                    },
                    new Client
                    {
                        Name = "Sofía",
                        LastName = "Hidalgo Ureña",
                        Phone = "85667788",
                        Email = "sofia.hidalgo@yahoo.com",
                        WithAppointment = true,
                        IsActive = true
                    },
                    new Client
                    {
                        Name = "Ricardo",
                        LastName = "Pereira Elizondo",
                        Phone = "89001122",
                        Email = "ricardo.pereira@gmail.com",
                        WithAppointment = false,
                        IsActive = true
                    }
                };

                context.Clients.AddRange(clients);
                await context.SaveChangesAsync();

                var appointments = new List<(Appointment App, List<int> ServiceIds)>
                {
                    (
                        new Appointment
                        {
                            Date = today.AddDays(-2),
                            Time = "09:00",
                            Status = "Completada",
                            Observations = "Cambio de aceite sintético y revisión general antes de viaje largo.",
                            IdBranch = branches[0].IdBranch,
                            IdClient = clients[0].IdClient,
                            VehiclePlate = "BJM-412",
                            VehicleBrand = "Toyota Hilux 4x4",
                            IsActive = true,
                            ClientWasCreatedHere = false
                        },
                        new List<int> { serviceList[0].IdService, serviceList[2].IdService }
                    ),
                    (
                        new Appointment
                        {
                            Date = today.AddDays(-1),
                            Time = "10:30",
                            Status = "Completada",
                            Observations = "Escaneo electrónico por testigo Check Engine y limpieza de sensores.",
                            IdBranch = branches[1].IdBranch,
                            IdClient = clients[1].IdClient,
                            VehiclePlate = "CRV-890",
                            VehicleBrand = "Honda CR-V",
                            IsActive = true,
                            ClientWasCreatedHere = false
                        },
                        new List<int> { serviceList[1].IdService }
                    ),
                    (
                        new Appointment
                        {
                            Date = today,
                            Time = "08:30",
                            Status = "Completada",
                            Observations = "Revisión de batería y cambio de filtros preventivos.",
                            IdBranch = branches[0].IdBranch,
                            IdClient = clients[4].IdClient,
                            VehiclePlate = "TUC-521",
                            VehicleBrand = "Hyundai Tucson",
                            IsActive = true,
                            ClientWasCreatedHere = false
                        },
                        new List<int> { serviceList[5].IdService }
                    ),
                    (
                        new Appointment
                        {
                            Date = today,
                            Time = "14:00",
                            Status = "En Proceso",
                            Observations = "Mantenimiento completo de frenos delanteros y traseros, cliente espera en sala.",
                            IdBranch = branches[0].IdBranch,
                            IdClient = clients[2].IdClient,
                            VehiclePlate = "NP3-004",
                            VehicleBrand = "Nissan Frontier",
                            IsActive = true,
                            ClientWasCreatedHere = false
                        },
                        new List<int> { serviceList[3].IdService }
                    ),
                    (
                        new Appointment
                        {
                            Date = today.AddDays(1),
                            Time = "09:00",
                            Status = "Confirmada",
                            Observations = "Afinamiento completo y limpieza de inyectores programada.",
                            IdBranch = branches[0].IdBranch,
                            IdClient = clients[0].IdClient,
                            VehiclePlate = "COR-778",
                            VehicleBrand = "Toyota Corolla",
                            IsActive = true,
                            ClientWasCreatedHere = false
                        },
                        new List<int> { serviceList[4].IdService }
                    ),
                    (
                        new Appointment
                        {
                            Date = today.AddDays(2),
                            Time = "11:00",
                            Status = "Confirmada",
                            Observations = "Alineado y balanceo 3D tras cambio de llantas.",
                            IdBranch = branches[1].IdBranch,
                            IdClient = clients[3].IdClient,
                            VehiclePlate = "MZD-310",
                            VehicleBrand = "Mazda CX-5",
                            IsActive = true,
                            ClientWasCreatedHere = false
                        },
                        new List<int> { serviceList[2].IdService }
                    ),
                    (
                        new Appointment
                        {
                            Date = today.AddDays(2),
                            Time = "15:00",
                            Status = "Pendiente",
                            Observations = "Solicita revisión por ruido al frenar y cambio de aceite.",
                            IdBranch = branches[0].IdBranch,
                            IdClient = clients[1].IdClient,
                            VehiclePlate = "SUZ-654",
                            VehicleBrand = "Suzuki Vitara",
                            IsActive = true,
                            ClientWasCreatedHere = false
                        },
                        new List<int> { serviceList[0].IdService, serviceList[3].IdService }
                    ),
                    (
                        new Appointment
                        {
                            Date = today.AddDays(3),
                            Time = "10:00",
                            Status = "Pendiente",
                            Observations = "Diagnóstico computarizado general antes de RTV/Dekra.",
                            IdBranch = branches[1].IdBranch,
                            IdClient = clients[4].IdClient,
                            VehiclePlate = "KIA-908",
                            VehicleBrand = "Kia Sportage",
                            IsActive = true,
                            ClientWasCreatedHere = false
                        },
                        new List<int> { serviceList[1].IdService, serviceList[3].IdService }
                    )
                };

                foreach (var entry in appointments)
                {
                    context.Appointments.Add(entry.App);
                    await context.SaveChangesAsync();

                    foreach (var sid in entry.ServiceIds)
                    {
                        context.AppointmentServices.Add(new AppointmentService
                        {
                            IdAppointment = entry.App.IdAppointment,
                            IdService = sid
                        });
                    }
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
