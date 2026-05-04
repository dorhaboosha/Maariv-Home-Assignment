# Build stage — restore and publish the app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish MaarivMiniApp.Api.csproj -c Release -o /app/out

# Runtime stage — lean image with only the runtime (no SDK)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 8080
ENTRYPOINT ["dotnet", "MaarivMiniApp.Api.dll"]
