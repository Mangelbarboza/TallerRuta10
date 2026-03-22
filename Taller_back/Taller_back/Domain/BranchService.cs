namespace Taller_back.Domain
{
     public class BranchService
        {
            public int IdBranch { get; set; }
            public int IdService { get; set; }

            public Branch Branch { get; set; }
            public Service Service { get; set; }

            public bool IsActive { get; set; }
    }

}
