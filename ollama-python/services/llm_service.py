import ollama

async def chat_with_llm(model,messages ):
    # print(f"Chatting with LLM with model {model}")
    try:
        result = ollama.chat(model=model, messages=messages)
        return result.message.content
    except Exception as e:
        print("Error getting response from LLM: ", e)
        return f"Error getting response from LLM: {e}"