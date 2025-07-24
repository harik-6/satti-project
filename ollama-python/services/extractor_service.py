import services.llm_service as llm_service

async def format_ai_text(full_text, what_to_extract):
   try:
       chat_messages = [
           {"role": "system", "content": f"You are a text extractor. Extract the {what_to_extract} from the user given text.Do not make up any funds one your own"},
           {"role": "user", "content": full_text},
       ]
       # print(f"Extraction service chat messages: {chat_messages}")

       response = await llm_service.chat_with_llm(model="llama3.2:latest", messages=chat_messages)
       return response
   except Exception as e:
       return f"Error extracting text: {e}"