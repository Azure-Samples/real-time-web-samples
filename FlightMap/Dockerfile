# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for full license information.

FROM mcr.microsoft.com/dotnet/core/sdk:2.1-stretch AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY NuGet.config ./
RUN mkdir FlightMap && cd FlightMap/
COPY *.csproj ./
RUN dotnet restore

# copy everything else and build
COPY ./ ./
RUN dotnet publish -c Release -o out

# build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:2.1
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "FlightMap.dll"]
