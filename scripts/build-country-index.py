#!/usr/bin/env python3
"""Convert a DB-IP Country Lite CSV.gz into the server's compact offline index."""
import argparse
import csv
import gzip
import hashlib
import io
import ipaddress
import re
import struct
from pathlib import Path


def build(source, target, expected_sha1):
    raw = gzip.decompress(source.read_bytes())
    if hashlib.sha1(raw).hexdigest() != expected_sha1:
        raise ValueError("CSV checksum differs from the DB-IP download page")
    tables = {4: [], 6: []}
    next_ip = {4: 0, 6: 0}

    def append(version, start, country):
        table = tables[version]
        if not table or table[-1][1] != country:
            table.append((start, country))

    for first, last, country in csv.reader(io.StringIO(raw.decode("ascii"))):
        a, b = ipaddress.ip_address(first), ipaddress.ip_address(last)
        v = a.version
        if (b.version != v or int(a) < next_ip[v] or int(a) > int(b)
                or not re.fullmatch(r"[A-Z]{2}", country)):
            raise ValueError("Invalid or unsorted DB-IP country data")
        if int(a) > next_ip[v]:
            append(v, next_ip[v], "ZZ")
        append(v, int(a), country)
        next_ip[v] = int(b) + 1
    for v, bits in [(4, 32), (6, 128)]:
        if next_ip[v] < 1 << bits:
            append(v, next_ip[v], "ZZ")
    binary = bytearray(b"DBC1" + struct.pack(">II", len(tables[4]), len(tables[6])))
    for v, width in [(4, 4), (6, 16)]:
        for start, country in tables[v]:
            binary.extend(start.to_bytes(width, "big") + country.encode("ascii"))
    target.parent.mkdir(exist_ok=True, parents=True)
    target.write_bytes(gzip.compress(binary, compresslevel=9, mtime=0))
    print(f"{len(tables[4])} IPv4 / {len(tables[6])} IPv6 ranges, {target.stat().st_size} bytes")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("target", type=Path)
    parser.add_argument("--sha1", required=True, help="Official uncompressed CSV checksum")
    args = parser.parse_args()
    build(args.source, args.target, args.sha1)
