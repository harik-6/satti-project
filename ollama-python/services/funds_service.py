import services.llm_service as llm_service

async def select_funds(behaviour: str):
    with open("data_prep/data.txt", 'r') as file:
        mf_data = file.read()

    user_input = f"""
    I want to invest 50% of my income in less risk asset, 25% percent in moderate risk assets and 25% percent in high risk assets.
    Based on this information and this data {mf_data}, Suggest me one fund in each category one low risk fund, one high risk fund and one low risk fund 
    and each fund should be from different fund house. Do not suggest any fund which is not mentioned in the data.
    """

    fund_selection_chat = [
        {"role": "system", "content": "You are a financial advisor helping in choosing mutual funds wisely."},
        {"role": "user", "content": ""},
    ]

    fund_selection_chat[1]["content"] = user_input

    try:
        print("Fund selection started")
        response = await llm_service.chat_with_llm(model="0xroyce/plutus:latest", messages=fund_selection_chat)
        print("Fund selection ended")
        return response
    except Exception as e:
        print("Error getting funds: ", e)
        print(f"Error getting funds: {e}")