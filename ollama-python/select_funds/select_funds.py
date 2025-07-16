import ollama

async def select_funds():
    user_input = """
    I want to invest 50% of my income in less risk asset, 25 percent in moderate risk assets and 25 percent in high risk assets.
    I have data of funds with parameters like Standard deviation, Beta, Sharpe Ratio, Jension's Alpha, Treynor's Ratio and how much
    the returns are in last 1 year, 3 years, 5 years should look like ?
    Tell how these parameter should look like for each funds that i should invest as per the risk i told you above.
    """

    parameter_selection_chat = [
        {"role": "system", "content": "You are a financial advisor helping in choosing mutual funds."},
        {"role": "user", "content": ""},
    ]

    parameter_selection_chat[1]["content"] = user_input

    try:
        print("Parameter selection started")
        result = ollama.chat(model="0xroyce/plutus:latest", messages=parameter_selection_chat)
        # print(result.message.content)
        print("Parameter selection ended")

        with open("data_prep/data.txt", 'r') as file:
            mf_data = file.read()

        system_prompt = f"""You are a financial advisor and help me choosing the right fund. These are important rules to be followed:
        1. suggest only one fund for each risk category less risk, moderate risk 
        and high risk. 2. Do not suggest any fund which is not in the data. 3.
        4. Do not suggest any fund which is not in the data. 5. Do not suggest any fund which is not in the data. 6.
         so maximum 3 funds totally and do not select funds with same starting word in each category"""
        user_prompt = f"""Based on these suggestions {result.message.content}. use this data {mf_data} """

        fund_selection_chat = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        print("Fund selection started")
        result = ollama.chat(model="llama3.2:latest", messages=fund_selection_chat)
        # print(result.message.content)
        print("Fund selection ended")
        return result.message.content
    except Exception as e:
        print(f"Error getting classification: {e}")