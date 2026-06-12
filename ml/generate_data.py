import json
import os 

STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
    "Taraba", "Yobe", "Zamfara"
]

PRODUCTS = ["Rice", "Cement", "Suger", "Flour", "Cooking Oil"]


def calculate_shortage_risk(demand, supply):
    gap = demand - supply
    if gap > 30:
        return "Heigh"
    elif gap > 0:
        return "Medium"
    else:
        return "low"
def generate_mvp_data():
    os.makedirs("../backend/data", exist_ok=True)

    for product in PRODUCTS:
        product_data = []
        for state in STATES:
            demand_score = 50
            supply_score = 60
            trend = "stable"
            opportunity = False



            if state in ["Lagos", "Ogun"] and product == "Rice":
                demand_score = 92
                supply_score = 45

                trend = "rising"

            elif state == 'Kano' and product == "Rice":
                demand_score = 40
                supply_score = 85
                trend = "failling"
                opportunity = True

            elif state in ["FCT - Abuja", "Rivers"]:
                demand_score = 75
                supply_score = 50
                trend = "rising"

            shortage_risk = calculate_shortage_risk(demand_score, supply_score),

            state_entry = {
                "state_name": state,
                "product": product,
                "demand_score": demand_score,
                "supply_score": supply_score,
                "trend": trend,
                "shortage_risk": shortage_risk,
                "opportunity": opportunity
            }
            product_data.append(state_entry)

            filename = f"../backend/data/{product.lower().replace(' ', '_')}.json" #[cite: 72, 145]
        with open(filename, "w") as f:
            json.dump(product_data, f, indent=4)
            
    print("✅ MVP Simulated JSON data generated successfully for all products!")

if __name__ == "__main__":
    generate_mvp_data()

