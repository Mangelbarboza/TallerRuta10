using Taller_back.Domain;

public class Product
{
    public int IdProduct { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Image { get; set; }
    public decimal SalePrice { get; set; }

    public int IdSupplier { get; set; }
    public Supplier Supplier { get; set; } = null!;

    public bool IsActive { get; set; }

    public ICollection<BranchProduct> BranchProducts { get; set; } = new List<BranchProduct>();

    public int? IdOffer { get; set; }
    public Offer? Offer { get; set; }
}
