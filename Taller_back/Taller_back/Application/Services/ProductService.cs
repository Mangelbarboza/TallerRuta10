using Taller_back.Application.DTOs.Branch;
using Taller_back.Application.DTOs.Product;
using Taller_back.Application.Interface;
using Taller_back.Domain;

namespace Taller_back.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ISupplierRepository _supplierRepository;
        private readonly IBranchProductRepository _branchProductRepository;
        private readonly IFileService _fileService;

        public ProductService(
            IProductRepository productRepository,
            ISupplierRepository supplierRepository,
            IFileService fileService,
            IBranchProductRepository branchProductRepository
)
        {
            _productRepository = productRepository;
            _supplierRepository = supplierRepository;
            _fileService = fileService;
            _branchProductRepository = branchProductRepository;
        }

        public async Task CreateAsync(CreateProductDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new Exception("El nombre del producto es obligatorio");

            if (dto.SalePrice <= 0)
                throw new Exception("El precio debe ser mayor a cero");

            string? imagePath = null;

            if (dto.Image != null)
            {
                imagePath = await _fileService.SaveFileAsync(dto.Image, "productos");
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                SalePrice = dto.SalePrice,
                IdSupplier = dto.IdSupplier,
                Image = imagePath,
                IsActive = true
            };

            await _productRepository.AddAsync(product);

            foreach (var branch in dto.Branches)
            {
                var branchProduct = new BranchProduct
                {
                    IdBranch = branch.IdBranch,
                    IdProduct = product.IdProduct,
                    Stock = branch.Stock
                };

                await _branchProductRepository.AddAsync(branchProduct);
            }
        }


        public async Task<List<ProductDTO>> GetAllAsync()
        {
            var products = await _productRepository.GetAllAsync();

            return products.Select(p => new ProductDTO
            {
                IdProduct = p.IdProduct,
                Name = p.Name,
                Description = p.Description,
                SalePrice = p.SalePrice,
                IdSupplier = p.IdSupplier,
                SupplierName = p.Supplier.Name,
                Image = p.Image,
                IdOffer = p.IdOffer,
                Discount = p.Offer != null ? p.Offer.Discount : null
            }).ToList();
        }

        public async Task<bool> UpdateAsync(int id, UpdateProductDTO dto)
        {
            var product = await _productRepository.GetByIdWithBranchesAsync(id);
            if (product == null) return false;

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.SalePrice = dto.SalePrice;
            product.IdSupplier = dto.IdSupplier;
            product.IdOffer = dto.IdOffer;

            if (dto.Image != null)
            {
                var imagePath = await _fileService.SaveFileAsync(dto.Image, "productos");
                product.Image = imagePath;
            }

            product.BranchProducts.Clear();

            foreach (var branch in dto.Branches)
            {
                product.BranchProducts.Add(new BranchProduct
                {
                    IdProduct = product.IdProduct,
                    IdBranch = branch.IdBranch,
                    Stock = branch.Stock
                });
            }

            await _productRepository.UpdateAsync(product);

            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
                return false;

            product.IsActive = false;

            await _productRepository.UpdateAsync(product);

            return true;
        }
        public async Task<UpdateProductDTO?> GetByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdWithBranchesAsync(id);

            if (product == null)
                return null;
           
            return new UpdateProductDTO
            {
                IdProduct = product.IdProduct,
                Name = product.Name,
                Description = product.Description,
                SalePrice = product.SalePrice,
                IdSupplier = product.IdSupplier,
                IdOffer = product.IdOffer,
                Discount = product.Offer?.Discount,
                ImagePath = product.Image,
                Branches = product.BranchProducts.Select(bp => new BranchStockDTO
                {
                    IdBranch = bp.IdBranch,
                    Stock = bp.Stock
                }).ToList()
                
            };
        }

    }
}
