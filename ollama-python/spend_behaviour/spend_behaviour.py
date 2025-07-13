import ollama

def read_system_prompt():
    file_path = "spend_behaviour/spend_behaviour.txt"
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        system_message = f"You are a financial advisor in India and only based on the context provided:This is the context {content},Classify what kind of spender I am and just tell the percentage allocation on essential, discretionary and savings only no more other data and do not make any assumptions other than the user input.Give me in a well formatted markdown format"
        return system_message
    except Exception as e:
        return e 

# def main():
#     user_input = """
#     I earn $15300 per month. I spend about $2000 on rent and utilities, $800 on food and groceries,
#     $300 on transportation. I spend around $1200 on entertainment, dining out, and shopping.
#     I save about $10000 per month in my savings account and investments. What kind of spender I am and Why?
#     """
#
#     print("\n🤖 AI Classification:")
#     print("-" * 30)
#     system_prompt = read_system_prompt("spend_behaviour.txt")
#
#     chat_messages = [
#         {"role": "system", "content": system_prompt},
#         {"role": "user", "content": ""},
#     ]
#     chat_messages[1]["content"] = user_input
#
#     try:
#         result = ollama.chat(model="llama3.2:latest", messages=chat_messages)
#         print(result.message.content)
#     except Exception as e:
#         return f"Error getting classification: {e}"

# if __name__ == "__main__":
#     main()

async def classify_behaviour(user_prompt):
    system_prompt = read_system_prompt()

    # print(f"User prompt (classify_behaviour) : {user_prompt}")
    # print(f"System prompt (classify_behaviour): {system_prompt}")

    chat_messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": ""},
    ]

    chat_messages[1]["content"] = user_prompt

    try:
        result = ollama.chat(model="llama3.2:latest", messages=chat_messages)
        return result.message.content
    except Exception as e:
        return f"Error getting classification: {e}"


