# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5285

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Rich4Backend.csproj", "./"]
RUN dotnet restore "Rich4Backend.csproj"
COPY . .
RUN dotnet build "Rich4Backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Rich4Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Rich4Backend.dll"]
