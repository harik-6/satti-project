import services.llm_service as llm_service

async def get_recommended_funds(allocation_text: str):
    with open("mf_data_set1.json", 'r') as file:
        mf_data = file.read()

    system_prompt = f"""
    You are a financial advisor and based on this information of mutual funds data only {mf_data}, answer the questions that is asked.
    If you are not able to find any data related to the question do not make up any answers.".
    """

    fund_selection_chat = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Based on this recomended allocation {allocation_text}, select one fund in Gold and one Fund in equity and give"
                                    f"a 30 words reasoning for each selected based on the data provided."},
    ]

    try:
        print("Fund selection started")
        response = await llm_service.chat_with_llm(model="llama3.2:latest", messages=fund_selection_chat)
        print("Fund selection ended")
        return response
    except Exception as e:
        print("Error getting funds: ", e)
        return f"Error getting funds: {e}"

async def allocate_fund_by_percentage(behaviour: str):
    with open("rules_files/allocation_rule.txt", 'r') as file:
        allocation_rules = file.read()

    system_prompt = f"""
        You are financial advisor and based on this information of allocation rules {allocation_rules}, answer the questions that is asked.
        If you are not able to find any data related to the question do not make up any answers".
        """

    user_prompt = f"I am a {behaviour} spender. How should I allocate my funds? Give the me Investment Strategy in 50 words and the Reasoning in 50 words."

    fund_allocation_chat = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    try:
        print(f"Fund allocation percentage selection started")
        response = await llm_service.chat_with_llm(model="llama3.2:latest", messages=fund_allocation_chat)
        print(f"Fund allocation percentage selection ended")
        return response
    except Exception as e:
        print("Error getting fund allocation percentage: ", e)
        return f"Error getting fund allocation percentage: {e}"
    pass