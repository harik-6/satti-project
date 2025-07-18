import services.llm_service as llm_service

async def categorize_tags(file_name: str):
    try:
        with open(f"uploaded_files/{file_name}", "r", encoding="utf-8") as file:
            content = file.readlines()
            transactions = []
            for line in content[1:]:
                line = line.strip()
                if line:
                    parts = line.split(",")
                    if len(parts) >=7:
                        transactions.append({
                            "date": parts[0].strip(),
                            "narration": parts[1].strip(),
                            "debit": parts[3].strip(),
                            "credit": parts[4].strip(),
                            "category": "untagged"
                        })

            print(f"Transforming text file to usable json completed for {file_name}. Total transactions: {len(transactions)}")

            with open("rules_files/tagging_rule.txt", "r", encoding="utf-8") as rule:
                tagging_rules = rule.read()

            system_prompt = f"Help me classify the transactions description into its appropriate category using only one word. Use this information {tagging_rules}"

            for transaction in transactions:
                chat_messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"This is the transaction description: {transaction['narration'].split("@")[0].strip()}. "
                                                f"Based on the keywords in the description, classify it into one of the categories and respond with only one word."},
                ]
                response = await llm_service.chat_with_llm(model="llama3.2:latest", messages=chat_messages)
                transaction["category"] = response.lower().strip()
        return transactions
    except Exception as e:
        print(f"Error categorizing tags: {e}")
        return e

