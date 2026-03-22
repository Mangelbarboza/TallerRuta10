using Taller_back.Application.DTOs.Client;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;

        public ClientService(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public async Task CreateAsync(CreateClientDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.LastName) ||
                string.IsNullOrWhiteSpace(dto.Phone) ||
                string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new Exception("Todos los campos del cliente son obligatorios");
            }

            if (await _clientRepository.GetByPhoneAsync(dto.Phone) != null)
                throw new Exception("El teléfono ya está registrado");

            if (await _clientRepository.GetByEmailAsync(dto.Email) != null)
                throw new Exception("El correo ya está registrado");

            var client = new Client
            {
                Name = dto.Name,
                LastName = dto.LastName,
                Phone = dto.Phone,
                Email = dto.Email,
                WithAppointment = dto.WithAppointment,
                IsActive = true
            };

            await _clientRepository.AddAsync(client);
        }

        public async Task UpdateAsync(int id, UpdateClientDTO dto)
        {
            var client = await _clientRepository.GetByIdAsync(id);
            if (client == null) return;

            if (client.Phone != dto.Phone &&
                await _clientRepository.GetByPhoneAsync(dto.Phone) != null)
                throw new Exception("El teléfono ya está registrado");

            if (client.Email != dto.Email &&
                await _clientRepository.GetByEmailAsync(dto.Email) != null)
                throw new Exception("El correo ya está registrado");

            client.Name = dto.Name;
            client.LastName = dto.LastName;
            client.Phone = dto.Phone;
            client.Email = dto.Email;
            client.WithAppointment = dto.WithAppointment;

            await _clientRepository.UpdateAsync(client);
        }

        public async Task<List<ClientDTO>> GetAllAsync()
        {
            var clients = await _clientRepository.GetAllAsync();

            return clients
        .Where(c => c.IsActive)
        .Select(c => new ClientDTO
        {
            IdClient = c.IdClient,
            Name = c.Name,
            LastName = c.LastName,
            Phone = c.Phone,
            Email = c.Email,
            WithAppointment = c.WithAppointment
        })
        .ToList();
        }

        public async Task DeleteAsync(int id)
        {
            var client = await _clientRepository.GetByIdAsync(id);

            if (client == null)
                return;

            if (client.IsActive)
                client.IsActive = false;

            await _clientRepository.UpdateAsync(client);
        }

    }
}
