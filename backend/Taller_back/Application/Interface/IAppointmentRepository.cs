using Taller_back.Domain;

namespace Taller_back.Application.Interface
{
    public interface IAppointmentRepository
    {
        Task<List<Appointment>> GetAllAsync();
        Task<Appointment?> GetByIdAsync(int id);

        Task<bool> BranchExistsAndActiveAsync(int idBranch);
        Task<Client?> GetClientByIdAsync(int idClient);

        Task<Client?> GetClientByEmailAsync(string email);
        Task<Client?> GetClientByPhoneAsync(string phone);

        Task<Client> CreateClientAsync(Client client);
        Task<Appointment> CreateAppointmentAsync(Appointment appointment);
        Task AddAppointmentServicesAsync(List<AppointmentService> links);

        Task<Appointment?> GetByIdWithIncludesAsync(int id);
        Task<Appointment?> GetByIdForUpdateAsync(int id);

        Task ReplaceAppointmentServicesAsync(int idAppointment, List<int> serviceIds);

        Task<bool> SaveAsync();
        Task<bool> SoftDeleteAsync(int id);
    }
}
