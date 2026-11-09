# DB-IP Country Lite

The bundled offline country index is derived from [DB-IP Country Lite](https://db-ip.com/db/download/ip-to-country-lite), November 2026. The source database is © DB-IP.com and licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Pages displaying these results must link to [IP Geolocation by DB-IP](https://db-ip.com/).

The conversion uses only the address ranges and country codes. It coalesces adjacent ranges for the same country and repacks them into a compressed binary search index. The server needs no external geolocation request or account. Country estimates can be wrong, especially for VPNs, proxies and mobile networks.

To reproduce the index, download the [original CSV archive](https://download.db-ip.com/free/dbip-country-lite-2026-11.csv.gz) and run:

```sh
python3 scripts/build-country-index.py dbip-country-lite-2026-11.csv.gz resources/geoip/country.bin.gz --sha1 e2061015c43ec91c94a12191a6a613279eb94c0c
```

For a later monthly release, use the corresponding CSV checksum published by DB-IP and update the date and source above.
