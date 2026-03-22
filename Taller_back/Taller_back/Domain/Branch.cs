namespace Taller_back.Domain
{
    public class Branch
    {
        public int IdBranch { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Schedule { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; }
        public ICollection<BranchService> BranchServices { get; set; }
        public ICollection<BranchProduct> BranchProducts { get; set; } = new List<BranchProduct>();
    }
}
