FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# 1. Copiamos todo el contenido del repo al contenedor
COPY . ./

# 2. Entramos a la carpeta donde está el archivo .sln antes de restaurar
# Según tus fotos, la ruta es Taller_back/Taller_back.sln
RUN dotnet restore "Taller_back/Taller_back.sln"

# 3. Publicamos apuntando específicamente al proyecto o a la solución
# Ajustamos la ruta de salida a /app/out
RUN dotnet publish "Taller_back/Taller_back.sln" -c Release -o out

# Etapa de ejecución
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Render usa la variable de entorno PORT
ENV ASPNETCORE_URLS=http://+:$PORT

# Asegúrate de que "Taller_back.dll" sea el nombre real del archivo generado
ENTRYPOINT ["dotnet", "Taller_back.dll"]