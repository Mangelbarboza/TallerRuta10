using Microsoft.EntityFrameworkCore;
using Taller_back.Application.DTOs.Appointment;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Application.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IEmailSender _emailSender;

        public AppointmentService(IAppointmentRepository appointmentRepository, IEmailSender emailSender)
        {
            _appointmentRepository = appointmentRepository;
            _emailSender = emailSender;
        }

        public async Task<List<AppointmentDTO>> GetAllAsync()
        {
            var list = await _appointmentRepository.GetAllAsync();
            return list.Select(MapToDTO).ToList();
        }

        public async Task<AppointmentDTO?> GetByIdAsync(int id)
        {
            var item = await _appointmentRepository.GetByIdAsync(id);
            return item == null ? null : MapToDTO(item);
        }

        public async Task<AppointmentDTO> CreateAsync(CreateAppointmentDTO dto)
        {
            if (dto.IdBranch <= 0)
                throw new InvalidOperationException("Debe asignar una sucursal válida.");

            var branchOk = await _appointmentRepository.BranchExistsAndActiveAsync(dto.IdBranch);
            if (!branchOk)
                throw new InvalidOperationException("La sucursal asignada no existe o está inactiva.");

            var hasExistingClient = dto.IdClient.HasValue && dto.IdClient.Value > 0;
            var hasNewClient = dto.NewClient != null;

            if (hasExistingClient && hasNewClient)
                throw new InvalidOperationException("Debe seleccionar un cliente existente o crear uno nuevo, no ambos.");

            if (!hasExistingClient && !hasNewClient)
                throw new InvalidOperationException("Debe seleccionar un cliente existente o crear uno nuevo.");

            var withAppointment = StatusGivesAppointment(dto.Status);

            int resolvedClientId;
            bool clientWasCreatedHere = false;
            string? clientEmail = null;
            string? clientFullName = null;

            if (hasExistingClient)
            {
                var client = await _appointmentRepository.GetClientByIdAsync(dto.IdClient!.Value);
                if (client == null)
                    throw new InvalidOperationException("El cliente seleccionado no existe.");

                if (!client.IsActive)
                    throw new InvalidOperationException("El cliente seleccionado está inactivo.");

                client.WithAppointment = withAppointment;
                resolvedClientId = client.IdClient;
                clientEmail = client.Email;
                clientFullName = $"{client.Name} {client.LastName}".Trim();
            }
            else
            {
                var email = dto.NewClient!.Email.Trim();
                var phone = dto.NewClient.Phone.Trim();

                var byEmail = await _appointmentRepository.GetClientByEmailAsync(email);
                var byPhone = await _appointmentRepository.GetClientByPhoneAsync(phone);

                var existing = byEmail ?? byPhone;

                if (existing != null)
                {
                    if (!existing.IsActive)
                        throw new InvalidOperationException("Existe un cliente con ese correo/teléfono pero está inactivo.");

                    existing.WithAppointment = withAppointment;
                    resolvedClientId = existing.IdClient;
                    clientEmail = existing.Email;
                    clientFullName = $"{existing.Name} {existing.LastName}".Trim();
                }
                else
                {
                    var newClient = new Client
                    {
                        Name = dto.NewClient.Name,
                        LastName = dto.NewClient.LastName,
                        Phone = phone,
                        Email = email,
                        WithAppointment = withAppointment,
                        IsActive = true
                    };

                    var createdClient = await _appointmentRepository.CreateClientAsync(newClient);
                    resolvedClientId = createdClient.IdClient;
                    clientWasCreatedHere = true;
                    clientEmail = createdClient.Email;
                    clientFullName = $"{createdClient.Name} {createdClient.LastName}".Trim();
                }
            }

            var appointment = new Appointment
            {
                Date = dto.Date,
                Time = dto.Time,
                Status = dto.Status,
                Observations = dto.Observations,
                IdBranch = dto.IdBranch,
                IdClient = resolvedClientId,
                VehiclePlate = dto.VehiclePlate,
                VehicleBrand = dto.VehicleBrand,
                IsActive = true,
                ClientWasCreatedHere = clientWasCreatedHere
            };

            try
            {
                var createdAppointment = await _appointmentRepository.CreateAppointmentAsync(appointment);

                var links = dto.ServiceIds == null ? new List<Taller_back.Domain.AppointmentService>() :
                    dto.ServiceIds
                        .Distinct()
                        .Select(idService => new Taller_back.Domain.AppointmentService
                        {
                            IdAppointment = createdAppointment.IdAppointment,
                            IdService = idService
                        })
                        .ToList();

                await _appointmentRepository.AddAppointmentServicesAsync(links);

                var loaded = await _appointmentRepository.GetByIdWithIncludesAsync(createdAppointment.IdAppointment);
                if (loaded == null)
                    throw new InvalidOperationException("La cita se creó, pero no se pudo cargar para devolverla.");

                var result = MapToDTO(loaded);

                if (!string.IsNullOrWhiteSpace(clientEmail))
                {
                    var subject = "Confirmación de cita - Taller";
                    var body = $"<p>Hola {clientFullName ?? ""},</p>" +
                               $"<p>Su cita ha sido registrada con los siguientes datos:</p>" +
                               $"<ul>" +
                               $"<li>Fecha: {loaded.Date:dd/MM/yyyy}</li>" +
                               $"<li>Hora: {loaded.Time}</li>" +
                               $"<li>Sucursal: {loaded.Branch?.Name ?? ""}</li>" +
                               $"<li>Observaciones: {System.Net.WebUtility.HtmlEncode(loaded.Observations ?? "")}</li>" +
                               $"</ul>" +
                               $"<p>Gracias por confiar en nosotros.</p>";

                    _ = _emailSender.SendEmailAsync(clientEmail, subject, body);
                }

                return result;
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("No se pudo crear la cita. Verifica los datos y las relaciones.", ex);
            }
        }

        public async Task<bool> UpdateAsync(int id, UpdateAppointmentDTO dto)
        {
            var appointment = await _appointmentRepository.GetByIdForUpdateAsync(id);
            if (appointment == null) return false;

            if (dto.IdBranch.HasValue && dto.IdBranch.Value != appointment.IdBranch)
            {
                var branchOk = await _appointmentRepository.BranchExistsAndActiveAsync(dto.IdBranch.Value);
                if (!branchOk)
                    throw new InvalidOperationException("La sucursal asignada no existe o está inactiva.");

                appointment.IdBranch = dto.IdBranch.Value;
            }

            if (dto.Date.HasValue)
                appointment.Date = dto.Date.Value;

            if (!string.IsNullOrWhiteSpace(dto.Time))
                appointment.Time = dto.Time;

            if (!string.IsNullOrWhiteSpace(dto.Status))
                appointment.Status = dto.Status;

            if (dto.Observations != null)
                appointment.Observations = dto.Observations;

            if (!string.IsNullOrWhiteSpace(dto.VehiclePlate))
                appointment.VehiclePlate = dto.VehiclePlate;

            if (!string.IsNullOrWhiteSpace(dto.VehicleBrand))
                appointment.VehicleBrand = dto.VehicleBrand;

            if (dto.ServiceIds != null)
                await _appointmentRepository.ReplaceAppointmentServicesAsync(appointment.IdAppointment, dto.ServiceIds);

            if (appointment.Client != null && !string.IsNullOrWhiteSpace(dto.Status))
            {
                appointment.Client.WithAppointment = StatusGivesAppointment(dto.Status);

                if (IsCancelled(dto.Status) && appointment.ClientWasCreatedHere)
                    appointment.Client.IsActive = false;
            }

            return await _appointmentRepository.SaveAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _appointmentRepository.SoftDeleteAsync(id);
        }

        private static bool StatusGivesAppointment(string status)
        {
            return string.Equals(status?.Trim(), "Confirmada", StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsCancelled(string status)
        {
            return string.Equals(status?.Trim(), "Cancelada", StringComparison.OrdinalIgnoreCase);
        }

        private static AppointmentDTO MapToDTO(Appointment a)
        {
            return new AppointmentDTO
            {
                IdAppointment = a.IdAppointment,
                Date = a.Date,
                Time = a.Time,
                Status = a.Status,
                Observations = a.Observations,
                IdBranch = a.IdBranch,
                IdClient = a.IdClient,
                VehiclePlate = a.VehiclePlate,
                VehicleBrand = a.VehicleBrand,
                IsActive = a.IsActive,
                Client = a.Client == null ? null : new AppointmentClientDTO
                {
                    IdClient = a.Client.IdClient,
                    Name = a.Client.Name,
                    LastName = a.Client.LastName,
                    Phone = a.Client.Phone,
                    Email = a.Client.Email,
                    WithAppointment = a.Client.WithAppointment
                },
                Branch = a.Branch == null ? null : new AppointmentBranchDTO
                {
                    IdBranch = a.Branch.IdBranch,
                    Name = a.Branch.Name,
                    Address = a.Branch.Address,
                    Phone = a.Branch.Phone,
                    Email = a.Branch.Email,
                    Schedule = a.Branch.Schedule,
                    Image = a.Branch.Image,
                    IsActive = a.Branch.IsActive
                },
                Services = a.AppointmentServices == null ? new List<AppointmentServiceItemDTO>() :
                    a.AppointmentServices
                     .Where(x => x.Service != null)
                     .Select(x => new AppointmentServiceItemDTO
                     {
                         IdService = x.Service.IdService,
                         Name = x.Service.Name,
                         Description = x.Service.Description,
                         BasePrice = x.Service.BasePrice,
                         IsActive = x.Service.IsActive
                     })
                     .ToList()
            };
        }
    }
}