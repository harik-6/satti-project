import ollama

def main():
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
        print(result.message.content)
        print("Parameter selection ended")
        # with open("../data_prep/data.txt", 'r') as file:
        #     mf_data = file.read()
        #
        # system_prompt = f"""You are a financial advisor and help me choosing the right fund"""
        # user_prompt = f"""I want to select funds that satisfy these conditions {result.message.content}. use this data {mf_data} to select 3 funds that matches the condition"""
        #
        # fund_selection_chat = [
        #     {"role": "system", "content": system_prompt},
        #     {"role": "user", "content": user_prompt},
        # ]
        #
        # print("Fund selection started")
        # result = ollama.chat(model="llama3.2:latest", messages=fund_selection_chat)
        # print("Fund selection ended")
        # print(result.message.content)
    except Exception as e:
        print(f"Error getting classification: {e}")




if __name__ == "__main__":
    main()