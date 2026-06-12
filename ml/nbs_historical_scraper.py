import os
import re
import zipfile
import io
import requests  
import time
from bs4 import BeautifulSoup

# Define the exact NBS microdata catalog entry for the Selected Food Price Watch
NBS_CATALOG_URL = "https://microdata.nigerianstat.gov.ng/index.php/catalog/162/related-materials"
DOWNLOAD_DIR = "./nbs_raw_downloads"
EXTRACT_DIR = "./nbs_excel_data"

def initialize_directories():
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)
    os.makedirs(EXTRACT_DIR, exist_ok=True)
    print("📁 Storage directories verified.")

def fetch_historical_download_links(catalog_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    max_retries = 3

    timeout_duration =45
    for attempt in range(1, max_retries + 1):
        print(f"🌐 Connecting to NBS Catalog page...")
        try:
            # FIXED: Explicitly using requests (with an s) to avoid urllib clash
            response = requests.get(catalog_url, headers=headers, timeout=15)
            response.raise_for_status()
            print("✅ Successfully connected to the NBS server!")
            break
        except requests.exceptions.RequestException as e:
            print(f"❌ Connection failed: {e}")
            if attempt < max_retries:
                print("⏳ Waiting 10 seconds before retrying...")
                time.sleep(10)

            else:
                print(f"❌ Connection failed after {max_retries} attempts: {e}")
                return []

    soup = BeautifulSoup(response.text, 'html.parser')
    download_links = []

    # Look for all anchor tags that lead to download end-points on the microdata engine
    for link in soup.find_all('a', href=True):
        href = link['href']
        
        # NBS download paths follow a /catalog/162/download/XXXX pattern
        if "/catalog/162/download/" in href:
            parent_row = link.find_parent('tr')
            description = parent_row.get_text() if parent_row else "Unknown Commodity File"
            description = " ".join(description.split())
            
            if href not in [l['url'] for l in download_links]:
                download_links.append({
                    "url": href,
                    "description": description
                })
                
    print(f"🔍 Found {len(download_links)} potential historical data download end-points.")
    return download_links

def download_and_extract_data(download_items):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    success_count = 0

    for index, item in enumerate(download_items):
        url = item['url']
        desc = item['description']
        
        date_match = re.search(r'(January|February|March|April|May|June|July|August|September|October|November|December)[-\s]\d{4}', desc, re.IGNORECASE)
        filename_base = f"nbs_entry_{index}"
        if date_match:
            filename_base = date_match.group(0).replace(" ", "_").replace("-", "_")
            
        print(f"\n📥 [{index + 1}/{len(download_items)}] Processing: {filename_base}")
        print(f"   Context: {desc[:90]}...")

        try:
            # FIXED: Explicitly using requests (with an s)
            res = requests.get(url, headers=headers, stream=True, timeout=30)
            res.raise_for_status()
            
            content_bytes = res.content
            
            if zipfile.is_zipfile(io.BytesIO(content_bytes)):
                with zipfile.ZipFile(io.BytesIO(content_bytes)) as z:
                    for zip_info in z.infolist():
                        if zip_info.filename.endswith('.xlsx') or zip_info.filename.endswith('.xls'):
                            zip_info.filename = f"{filename_base}_{os.path.basename(zip_info.filename)}"
                            z.extract(zip_info, EXTRACT_DIR)
                            print(f"   ✅ Extracted Spreadsheet Matrix: {zip_info.filename}")
                            success_count += 1
            else:
                content_type = res.headers.get('Content-Type', '')
                if 'excel' in content_type or 'spreadsheet' in content_type or url.endswith('.xlsx'):
                    target_file_path = os.path.join(EXTRACT_DIR, f"{filename_base}_table.xlsx")
                    with open(target_file_path, "wb") as f:
                        f.write(content_bytes)
                    print(f"   ✅ Saved direct sheet: {filename_base}_table.xlsx")
                    success_count += 1
                else:
                    print("   ⚠️ File downloaded is a raw PDF or text report summary. Skipping.")
                    
        except Exception as e:
            print(f"   ❌ Failed to process download stream from endpoint {url}: {e}")
            continue

    print(f"\n🏁 Pipeline completed. Successfully extracted {success_count} structural dataset files into '{EXTRACT_DIR}'.")

if __name__ == "__main__":
    initialize_directories()
    targets = fetch_historical_download_links(NBS_CATALOG_URL)
    if targets:
        download_and_extract_data(targets)