import services.llm_service as llm_service

def read_system_prompt():
    file_path = "rules_files/behaviour_rules.txt"
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        system_message = (f"You are a financial advisor in India and only based on the context provided:This is the context {content}."
                          f"classify the spending behaviour of the user based in 50/30/20 rule.")
        return system_message
    except Exception as e:
        return e 

async def classify_behaviour(sum_by_category):
    system_prompt = read_system_prompt()
    base_prompt = "This is how my monthly finance looks like and I spend "
    income_prompt = ""
    saving_prompt = ""
    investment_prompt = ""
    stock_prompt = ""

    for category, amount in sum_by_category.items():
        base_prompt += f"{amount} on {category} "
        if category == "income":
            income_prompt += f" and my Income is {amount}."
        elif category == "savings":
            saving_prompt += f" and I save {amount}."
        elif category == "investment":
            investment_prompt += f" and I Invest {amount} in funds and fixed deposits."
        elif category == "stocks":
            stock_prompt += f" and my I invest {amount} in stocks."
        else:
            base_prompt += f"{amount} on {category}"

    user_prompt = base_prompt + income_prompt + saving_prompt + investment_prompt + stock_prompt
    user_prompt += "Based on this information, classify my spending behaviour in 150 words.Do not assume any thing on your own only user the information provided."

    chat_messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    try:
        response = await llm_service.chat_with_llm(model="llama3.2:latest", messages=chat_messages)
        return response
    except Exception as e:
        print("Error getting classification: ", e)
        return f"Error getting classification: {e}"