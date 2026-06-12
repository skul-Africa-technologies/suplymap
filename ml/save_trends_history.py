from pytrends.request import TrendReq
import pandas as pd 
import os 
import time



def extract_and_save_trends(product_list, output_filename="trends_data.csv"):
    """
    Extracts 5 years of historical weekly search trends for a list of products 
    in Nigeria and saves them into a long-form CSV structured for time-series ML training.
    """

    pytrends = TrendReq(hl="en-US", tz=360)

    all_product_frames = []
    print(f"📦 Launching Robust 5-Year Data Extraction for {len(product_list)} products...")



    for index, product in enumerate(product_list):
        print(f"\n🔄 [{index+1}/{len(product_list)}] Fetching 5-year weekly matrix for: '{product}'")

        try:
            pytrends.build_payload(
                kw_list=[product],
                cat=0,
                timeframe='today 5-y',
                geo='NG'
            )


            historical_df = pytrends.interest_over_time()
            if not historical_df.empty:
                if 'isPartial' in historical_df.columns:
                    historical_df = historical_df.drop(columns=['isPartial'])


                melted_df = historical_df.reset_index().melt(
                    id_vars=['date'],
                    var_name='product',
                    value_name='demand_score'
                )


                all_product_frames.append(melted_df)
                print(f"✅ Successfully extracted data for {product}...")
            else:
                print(f"❌ No data found for {product}...")

        except Exception as e:
            print(f"❌ Error fetching data for {product}: {e}")


        print("cooling down to prevent Ip address block ...")
        import random
        cooldown = random.randint(25, 35)
        print(f"⏳ Dynamic cooling pause for {cooldown} seconds to protect your network IP...")
        time.sleep(cooldown)
    
    if all_product_frames:
        master_df = pd.concat(all_product_frames, ignore_index=True)
        master_df.rename(columns={'data': 'Date'}, inplace=True)


        master_df.to_csv(output_filename, index=False)
        print(f"\n🏁 Robust Dataset Compiled Successfully!")
        print(f"💾 File saved to: {os.path.abspath(output_filename)}")
        print(f"📊 Total Time-Series Rows Generated: {master_df.shape[0]}")
        
        print("\n👀 5-Year Matrix Structure Preview:")
        print(master_df.head(10))
        print("...")
        print(master_df.tail(10))
        
        return master_df
    else:
        print("❌ Pipeline failed. No data blocks were saved.")
        return None

if __name__ == "__main__":
    
    nigerian_market_goods = [
        "Rice", "Cement", "Sugar", "Flour", "Cooking Oil", 
        "Beans", "Yam", "Garri", "Onions", "Tomato"
    ]
    
    extract_and_save_trends(nigerian_market_goods)



