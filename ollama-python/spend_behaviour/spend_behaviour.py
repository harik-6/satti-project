import ollama

def read_system_prompt():
    file_path = "spend_behaviour/spend_behaviour.txt"
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        system_message = (f"You are a financial advisor and only based on the context provided:This is the context {content}."
                          f"classify the spending behaviour of the user")
        return system_message
    except Exception as e:
        return e 

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