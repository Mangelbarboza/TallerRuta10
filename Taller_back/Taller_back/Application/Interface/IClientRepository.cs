using Taller_back.Domain;

namespace Taller_back.Application.Interface
{
    public interface IClientRepository
    {
        Task<List<Client>> GetAllAsync();
        Task<Client?> GetByIdAsync(int id);
        Task<Client?> GetByPhoneAsync(string phone);
        Task<Client?> GetByEmailAsync(string email);
        Task AddAsync(Client client);
        Task UpdateAsync(Client client);
    }
}
