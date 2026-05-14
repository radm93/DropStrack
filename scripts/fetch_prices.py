#!/usr/bin/env python3
"""
Fetches CS2 case prices from Steam Community Market.
"""
import requests, json, time, os
from datetime import datetime, timezone

CASES = [
    "Fever Case", "Gallery Case", "Kilowatt Case", "Revolution Case", "Recoil Case",
    "Fracture Case", "Dreams & Nightmares Case", "Snakebite Case", "Clutch Case",
    "Danger Zone Case", "Prisma Case", "Prisma 2 Case", "Shadow Case", "Horizon Case",
    "Falchion Case", "Gamma 2 Case", "Revolver Case", "Gamma Case", "Spectrum 2 Case",
    "Chroma 3 Case", "Operation Phoenix Weapon Case", "Spectrum Case", "Chroma Case",
    "Operation Wildfire Case", "Chroma 2 Case", "Operation Broken Fang Case",
    "Operation Breakout Weapon Case", "Huntsman Weapon Case", "Glove Case",
    "eSports 2013 Winter Case", "CS:GO Weapon Case", "CS20 Case", "Shattered Web Case",
    "Operation Hydra Case", "Operation Vanguard Weapon Case", "eSports 2013 Case",
    "eSports 2014 Summer Case", "CS:GO Weapon Case 2", "CS:GO Weapon Case 3",
    "Winter Offensive Weapon Case", "Operation Bravo Case"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; DropStrack/1.0; +https://github.com/radm93/DropStrack)",
}

def fetch_price(name):
    url = "https://steamcommunity.com/market/priceoverview/"
    params = {"appid": 730, "currency": 1, "market_hash_name": name}
    try:
        r = requests.get(url, params=params, headers=HEADERS, timeout=10)
        if r.status_code == 429:
            time.sleep(60)
            r = requests.get(url, params=params, headers=HEADERS, timeout=10)
        if not r.ok:
            return None
        data = r.json()
        if not data.get("success"):
            return None
        return {
            "lowest_price": data.get("lowest_price", ""),
            "median_price": data.get("median_price", ""),
            "volume": data.get("volume", ""),
        }
    except:
        return None

def main():
    prices = {}
    for i, name in enumerate(CASES):
        print(f"[{i+1}/{len(CASES)}] {name}")
        result = fetch_price(name)
        if result:
            prices[name] = result
        else:
            prices[name] = {"lowest_price": "", "median_price": "", "volume": ""}
        time.sleep(1.5)

    output = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "count": len(prices),
        "prices": prices,
    }

    os.makedirs("api", exist_ok=True)
    with open("api/prices.json", "w") as f:
        json.dump(output, f, indent=2)

    print(f"Done. Updated {len(prices)} prices.")

if __name__ == "__main__":
    main()
