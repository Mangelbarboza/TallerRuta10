FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# 1. Copiamos todo
COPY . ./

# 2. Restauramos SOLO el proyecto de la API (ajusta "Api/Api.csproj" si el nombre es distinto)
# Usamos el path completo desde la raíz del repo
RUN dotnet restore "Taller_back/Taller_back/Api/Api.csproj"

# 3. Publicamos SOLO ese proyecto
RUN dotnet publish "Taller_back/Taller_back/Api/Api.csproj" -c Release -o out

# Etapa de ejecución
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENV ASPNETCORE_URLS=http://+:$PORT

# El nombre de la DLL suele ser el nombre del archivo .csproj
ENTRYPOINT ["dotnet", "Api.dll"]