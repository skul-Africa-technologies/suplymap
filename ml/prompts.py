def get_claude_recommendation_prompt(state_name, product, demand, supply, trend, shortage_risk):
    system_instruction = (
        "You are an expert supply chain analyst and logistics AI specialized in the Nigerian market. "
        "Your job is to give highly concise, 2-3 sentence actionable recommendations to distributors and merchants. "
        "Do not use introductory fluff or bullet points. Speak directly and professionally."
    )
    
    user_prompt = f"""
    Analyze the following market conditions and provide an immediate logistical recommendation:
    - State: {state_name}
    - Product: {product}
    - Current Demand Score: {demand}/100
    - Current Supply Score: {supply}/100
    - 7-Day Trend: {trend}
    - Computed Shortage Risk: {shortage_risk.upper()}
    
    Example output format:
    "Move 2 truckloads of Rice from Kano to Lagos this week. Demand is rising 18% vs last week and the price window is open."
    """
    
    return system_instruction, user_prompt