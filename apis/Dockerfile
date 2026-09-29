FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["apis.csproj", "./"]
RUN dotnet restore "apis.csproj"
COPY . .
RUN dotnet build "apis.csproj" -c Release -o /app/build
RUN dotnet publish "apis.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "apis.dll"]
