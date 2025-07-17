import ollama

async def format_ai_text(full_text, what_to_extract):
   try:
       chat_messages = [
           {"role": "system", "content": f"You are a text extractor. Extract the {what_to_extract} from the text."},
           {"role": "user", "content": full_text},
       ]
       response = ollama.chat(model="llama3.2:latest", messages=chat_messages)
       print(f"Response from the extractor: {response.message.content}")
       return response.message.content
   except Exception as e:
       return f"Error extracting text: {e}"