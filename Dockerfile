FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# 1. Copiamos todo el contenido del repositorio
COPY . ./

# 2. Restauramos apuntando a la CARPETA del proyecto principal
# .NET buscará automáticamente el archivo .csproj ahí dentro
RUN dotnet restore "Taller_back/Taller_back/"

# 3. Publicamos apuntando a la misma CARPETA
RUN dotnet publish "Taller_back/Taller_back/" -c Release -o out

# Etapa de ejecución
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Configuración para Render
ENV ASPNETCORE_URLS=http://+:$PORT

# 4. El punto de entrada
# Si tu proyecto se llama Taller_back, el archivo será Taller_back.dll
ENTRYPOINT ["dotnet", "Taller_back.dll"]