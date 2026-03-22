using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using Taller_back.Application.Interface;
using Taller_back.Application.Services;
using Taller_back.Domain;
using Taller_back.Infraestructure.Repository;
using AppointmentService = Taller_back.Application.Services.AppointmentService;
using BranchService = Taller_back.Application.Services.BranchService;

namespace Taller_back.Infraestructure.Settings
{
    public static class Dependencies
    {
        public static IServiceCollection DependencyCollection(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDBContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), sqlServerOptionsAction: sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null);
            }));

            services.AddScoped<IBranchRepository, BranchRepository>();
            services.AddScoped<IServiceRepository, ServiceRepository>();
            services.AddScoped<IOfferRepository, OfferRepository>();
            services.AddScoped<ISupplierRepository, SupplierRepository>();

            services.AddScoped<IClientRepository, ClientRepository>();

            services.AddScoped<IEmployeeRepository, EmployeeRepository>();


            services.AddScoped<IBranchService, BranchService>();
            services.AddScoped<IServiceService, ServiceService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<OfferService>();
            services.AddScoped<ISupplierService, SupplierService>();
            services.AddScoped<IBranchServiceService, BranchServiceService>();
            services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            services.AddScoped<IAppointmentService, AppointmentService>();

            services.AddScoped<IClientService, ClientService>();

            services.AddScoped<IEmployeeService, EmployeeService>();

            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductService, ProductService>();

            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductService, ProductService>();

            services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            services.AddScoped<IAppointmentService, Taller_back.Application.Services.AppointmentService>();
            services.AddScoped<IBranchProductRepository, BranchProductRepository>();

            return services;
        }
    }
}
