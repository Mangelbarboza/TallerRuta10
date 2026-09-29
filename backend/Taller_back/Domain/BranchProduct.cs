namespace Taller_back.Domain
{
    public class BranchProduct
    {
        public int IdBranch { get; set; }
        public int IdProduct { get; set; }
        public int Stock { get; set; }

        public Branch Branch { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }

}
