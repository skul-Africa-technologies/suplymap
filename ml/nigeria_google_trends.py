from pytrends.request import TrendReq
import pandas as pd
import time

def generate_nigerian_search_variants(product_name):
    """
    Takes a raw product name and returns localized phrases 
    that Nigerian buyers/traders actually search for.
    """
    # Clean the product name
    prod = product_name.strip()
    
    # Generate high-intent commercial variants
    return [
        f"Price of {prod}",
        f"{prod} market",
        f"Buy {prod}"
    ]

def extract_general_goods_trends(product_list):
    """
    Connects to Google Trends and extracts interest scores (0-100) 
    specifically for Nigerian markets over the last 30 days.
    """
    
    pytrends = TrendReq(hl='en-US', tz=360)
    
    compiled_demand_scores = {}
    
    print(f"🇳🇬 Streamlining demand extraction for {len(product_list)} general goods categories...")
    
    for product in product_list:
        
        search_phrases = generate_nigerian_search_variants(product)
        print(f"\n🔍 Analyzing market intent phrases for '{product}': {search_phrases}")
        
        try:
            
            pytrends.build_payload(
                kw_list=search_phrases,
                cat=0,                  
                timeframe='today 1-m',    
                geo='NG'                
            )
            
            # 3. Pull interest timelines
            daily_data = pytrends.interest_over_time()
            
            if not daily_data.empty:
                
                total_latest_score = 0
                for phrase in search_phrases:
                    if phrase in daily_data.columns:
                        total_latest_score += int(daily_data[phrase].iloc[-1])
                
                
                final_demand_index = int(total_latest_score / len(search_phrases))
                compiled_demand_scores[product] = final_demand_index
                print(f"📈 Consolidated Demand Index for {product}: {final_demand_index}/100")
            else:
                print(f"⚠️ Low volume or no recent data for {product}. Assigning baseline.")
                compiled_demand_scores[product] = 30
                
        except Exception as e:
            print(f"❌ Rate limit encountered or connection dropped for '{product}': {e}")
            # Safe default fallback so the ML pipeline doesn't break
            compiled_demand_scores[product] = 50
            
       
        print("⏳ Cool-down pause to prevent IP rate limits...")
        time.sleep(12)
        
    return compiled_demand_scores

if __name__ == "__main__":
    
    discovered_nigerian_goods = [
        "Rice", "Cement", "Sugar", "Flour", "Cooking Oil", 
        "Beans", "Yam", "Garri", "Onions", "Tomato"
    ]
    
   
    demand_snapshot = extract_general_goods_trends(discovered_nigerian_goods)
    
    print("\n🏁 Master Demand Matrix for Nigerian Inventories Summary:")
    for goods, score in demand_snapshot.items():
        print(f" -> {goods:<15} | Demand Level: {score}/100")