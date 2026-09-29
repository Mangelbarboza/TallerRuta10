using Microsoft.EntityFrameworkCore;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Infraestructure.Repository
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDBContext _context;

        public AppointmentRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Appointment>> GetAllAsync()
        {
            return await _context.Set<Appointment>()
                .AsNoTracking()
                .Include(a => a.Branch)
                .Include(a => a.Client)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(x => x.Service)
                .Where(a => a.IsActive)
                .ToListAsync();
        }

        public async Task<Appointment?> GetByIdAsync(int id)
        {
            return await _context.Set<Appointment>()
                .AsNoTracking()
                .Include(a => a.Branch)
                .Include(a => a.Client)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(x => x.Service)
                .FirstOrDefaultAsync(a => a.IdAppointment == id && a.IsActive);
        }

        public async Task<bool> BranchExistsAndActiveAsync(int idBranch)
        {
            return await _context.Set<Branch>()
                .AsNoTracking()
                .AnyAsync(b => b.IdBranch == idBranch && b.IsActive);
        }

        public async Task<Client?> GetClientByIdAsync(int idClient)
        {
            return await _context.Set<Client>()
                .FirstOrDefaultAsync(c => c.IdClient == idClient);
        }

        // ✅ NUEVO
        public async Task<Client?> GetClientByEmailAsync(string email)
        {
            return await _context.Set<Client>()
                .FirstOrDefaultAsync(c => c.Email == email);
        }

        // ✅ NUEVO
        public async Task<Client?> GetClientByPhoneAsync(string phone)
        {
            return await _context.Set<Client>()
                .FirstOrDefaultAsync(c => c.Phone == phone);
        }

        public async Task<Client> CreateClientAsync(Client client)
        {
            _context.Set<Client>().Add(client);
            await _context.SaveChangesAsync();
            return client;
        }

        public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
        {
            _context.Set<Appointment>().Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task AddAppointmentServicesAsync(List<AppointmentService> links)
        {
            if (links != null && links.Count > 0)
            {
                _context.Set<AppointmentService>().AddRange(links);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Appointment?> GetByIdWithIncludesAsync(int id)
        {
            return await _context.Set<Appointment>()
                .AsNoTracking()
                .Include(a => a.Branch)
                .Include(a => a.Client)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(x => x.Service)
                .FirstOrDefaultAsync(a => a.IdAppointment == id && a.IsActive);
        }

        public async Task<Appointment?> GetByIdForUpdateAsync(int id)
        {
            return await _context.Set<Appointment>()
                .Include(a => a.Client)
                .Include(a => a.AppointmentServices)
                .FirstOrDefaultAsync(a => a.IdAppointment == id && a.IsActive);
        }

        public async Task ReplaceAppointmentServicesAsync(int idAppointment, List<int> serviceIds)
        {
            var existing = await _context.Set<AppointmentService>()
                .Where(x => x.IdAppointment == idAppointment)
                .ToListAsync();

            if (existing.Count > 0)
                _context.Set<AppointmentService>().RemoveRange(existing);

            if (serviceIds != null && serviceIds.Count > 0)
            {
                var links = serviceIds
                    .Distinct()
                    .Select(idService => new AppointmentService
                    {
                        IdAppointment = idAppointment,
                        IdService = idService
                    })
                    .ToList();

                _context.Set<AppointmentService>().AddRange(links);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> SaveAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        public async Task<bool> SoftDeleteAsync(int id)
        {
            var appointment = await _context.Set<Appointment>()
                .Include(a => a.Client)
                .Include(a => a.AppointmentServices)
                .FirstOrDefaultAsync(a => a.IdAppointment == id && a.IsActive);

            if (appointment == null) return false;

            appointment.IsActive = false;

            if (appointment.Client != null)
            {
                appointment.Client.WithAppointment = false;

                if (appointment.ClientWasCreatedHere)
                    appointment.Client.IsActive = false;
            }

            var links = appointment.AppointmentServices?.ToList();
            if (links != null && links.Count > 0)
                _context.Set<AppointmentService>().RemoveRange(links);

            await _context.SaveChangesAsync();
            return true;
        }
    }
}