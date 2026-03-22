using Taller_back.Application.Interface;

namespace Taller_back.Application.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private const string UPLOADS_PATH = "uploads/photos";

        public FileService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string subDirectory)
        {
            string uploadPath = Path.Combine(_env.WebRootPath, UPLOADS_PATH, subDirectory);

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string filePath = Path.Combine(uploadPath, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"/{UPLOADS_PATH.Replace('\\', '/')}/{subDirectory}/{fileName}";
        }

        public async Task<bool> DeleteFileAsync(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath))
                    return false;

                var physicalPath = Path.Combine(_env.WebRootPath, filePath.TrimStart('/').Replace('/', '\\'));

                if (File.Exists(physicalPath))
                {
                    File.Delete(physicalPath);
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }
    }
}
