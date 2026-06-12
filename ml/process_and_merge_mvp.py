import os
import glob
import pandas as pd
import json

# Setup file system pathways
NBS_FOLDER = "./nbs_excel_data"
TRENDS_CSV = "historical_5y_demand_data.csv"
BACKEND_OUTPUT_DIR = "../backend/data"

# Unified target lists to ensure strict formatting matching the breakdown documents
TARGET_PRODUCTS = ["rice", "cement", "sugar", "flour", "cooking_oil"]

# Clean lookup mapping for the 36 states plus FCT
NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
    "Taraba", "Yobe", "Zamfara"
]

def clean_and_merge_data():
    print("🧹 Initializing master MVP data cleaning pipeline...")
    os.makedirs(BACKEND_OUTPUT_DIR, exist_ok=True)
    
    # FIX 1: Safely initialize master_output at the very top of the function scope
    master_output = {}
    latest_trends = pd.DataFrame()
    
    # -------------------------------------------------------------
    # STEP 1: Process Google Trends CSV (Extracting Latest Demand Signals)
    # -------------------------------------------------------------
    if os.path.exists(TRENDS_CSV):
        print(f"📈 Reading consumer search volume profiles from {TRENDS_CSV}...")
        try:
            trends_df = pd.read_csv(TRENDS_CSV)
            
            # FIX 2: Standardize column names to lowercase to handle both 'Product' and 'product'
            trends_df.columns = [col.lower() for col in trends_df.columns]
            
            if 'product' in trends_df.columns:
                trends_df['product'] = trends_df['product'].str.lower().str.replace(' ', '_')
                # Filter for your 5 streamlined products
                trends_df = trends_df[trends_df['product'].isin(TARGET_PRODUCTS)]
                
                # Sort by date to make sure we grab the most recent timeline sequence
                trends_df['date'] = pd.to_datetime(trends_df['date'])
                latest_date = trends_df['date'].max()
                latest_trends = trends_df[trends_df['date'] == latest_date]
            else:
                print("⚠️ 'product' column missing in CSV headers. Using default fallback profiles.")
        except Exception as e:
            print(f"⚠️ Could not process trends CSV fully: {e}. Generating baseline demand fallbacks.")
    else:
        print(f"⚠️ {TRENDS_CSV} not found. Using default baseline demand profiles.")

    # -------------------------------------------------------------
    # STEP 2: Process NBS Excel Matrix Folder (Extracting Supply Signals)
    # -------------------------------------------------------------
    print(f"📂 Scanning NBS data entries inside '{NBS_FOLDER}'...")
    excel_files = glob.glob(os.path.join(NBS_FOLDER, "*.xlsx")) + glob.glob(os.path.join(NBS_FOLDER, "*.xls"))
    
    nbs_df = pd.DataFrame()
    if excel_files:
        latest_file = max(excel_files, key=os.path.getmtime)
        print(f"📋 Extracting pricing matrices from latest file: {os.path.basename(latest_file)}")
        try:
            nbs_df = pd.read_excel(latest_file)
            # Ensure the state names match clean text format
            nbs_df.iloc[:, 0] = nbs_df.iloc[:, 0].astype(str).str.strip()
        except Exception as e:
            print(f"❌ Error reading Excel file: {e}")
    else:
        print("⚠️ No downloaded NBS Excel files found. Building algorithmic baseline matrix.")

    # -------------------------------------------------------------
    # STEP 3: Combine Streams into the Unified JSON File Backend Payload
    # -------------------------------------------------------------
    for product in TARGET_PRODUCTS:
        product_entries = []
        
        # Fetch global demand benchmark for this product from our Trends timeline
        global_demand_score = 60 # Safe default baseline
        if not latest_trends.empty and 'product' in latest_trends.columns:
            product_trend_rows = latest_trends[latest_trends['product'] == product]
            if not product_trend_rows.empty and 'demand_score' in product_trend_rows.columns:
                global_demand_score = int(product_trend_rows['demand_score'].values[0])

        for state in NIGERIAN_STATES:
            # --- Calculating Demand Score ---
            demand_score = global_demand_score
            if state in ["Lagos", "Kano", "FCT - Abuja"] and product in ["rice", "cooking_oil"]:
                demand_score = min(int(demand_score * 1.35), 98)
            elif state in ["Rivers", "Ogun"] and product == "cement":
                demand_score = min(int(demand_score * 1.25), 95)
                
            # --- Calculating Supply Score ---
            supply_score = 65 # Default median standard
            if not nbs_df.empty:
                # Find row corresponding to current state
                state_row = nbs_df[nbs_df.iloc[:, 0].str.lower() == state.lower()]
                if not state_row.empty:
                    # Look up product price column dynamically if it matches our targets
                    possible_cols = [col for col in nbs_df.columns if product.replace('_', ' ') in col.lower() or product.split('_')[0] in col.lower()]
                    if possible_cols:
                        try:
                            raw_val = state_row[possible_cols[0]].values[0]
                            price_val = float(str(raw_val).replace(',', '').replace('₦', ''))
                            # INVERSE RULE: Higher relative prices indicate low supply availability
                            if price_val > 0:
                                supply_score = max(int(100 - (price_val / 45)), 25) 
                        except (ValueError, TypeError):
                            pass

            # --- Calculating Shortage Risk ---
            gap = demand_score - supply_score
            if gap > 20:
                shortage_risk = "high"
                trend = "rising"
            elif gap > 0:
                shortage_risk = "medium"
                trend = "stable"
            else:
                shortage_risk = "low"
                trend = "falling"

            state_payload = {
                "state_name": state,
                "product": product.replace('_', ' ').title(),
                "demand_score": int(demand_score),
                "supply_score": int(supply_score),
                "trend": trend,
                "shortage_risk": shortage_risk,
                "opportunity": True if (supply_score > 75 and demand_score < 45) else False
            }
            product_entries.append(state_payload)
            
        # Add to the unified dataset object organized by product key
        master_output[product] = product_entries
        
        # Save an individual JSON copy per product as a direct backup endpoint option
        single_product_path = os.path.join(BACKEND_OUTPUT_DIR, f"{product}.json")
        with open(single_product_path, 'w') as p_file:
            json.dump(product_entries, p_file, indent=4)

    # Save the combined nested dictionary for a clean master endpoint match
    master_json_path = os.path.join(BACKEND_OUTPUT_DIR, "market_map_data.json")
    with open(master_json_path, 'w') as m_file:
        json.dump(master_output, m_file, indent=4)
        
    print(f"\n🏁 Complete! Unified structural payloads exported into: '{BACKEND_OUTPUT_DIR}'")
    print("💾 Files written: market_map_data.json plus individual product sheets.")

if __name__ == "__main__":
    clean_and_merge_data()