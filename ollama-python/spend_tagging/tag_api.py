from http.client import HTTPException
from models import TagRequest

async def get_tags():
    try:
        with open("spend_tagging/tag_database.txt", "r", encoding="utf-8") as file:
            content = file.readlines()
            result = []
            for line in content:
                line = line.strip()
                if line:  # Skip empty lines
                    parts = line.split(",")  # Split only on first comma to handle commas in narration
                    if len(parts) >= 3:
                        result.append({
                            "id": parts[0],
                            "narration": parts[1],
                            "category": parts[2]
                        })
            file.close()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting tags: {str(e)}")

async def add_tag(req: TagRequest):
    try:
        with open("spend_tagging/tag_database.txt", "r", encoding="utf-8") as f:
            content = f.readlines()
            id = len(content) + 1
            f.close()

        with open("spend_tagging/tag_database.txt", "a", encoding="utf-8") as file:
            new_line = f"\n{id},{req.narration.strip().lower()},{req.category.strip().lower()}"
            file.write(new_line)
            file.close()
        return "OK"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding tag: {str(e)}")

async def update_tag(id: str, category: str):
    try:
        index = 1
        with open("spend_tagging/tag_database.txt", "r", encoding="utf-8") as f:
            content = f.readlines()

        with open("spend_tagging/tag_database.txt", "w", encoding="utf-8") as file:
            for line in content:
                line = line.strip()
                parts = line.split(",")
                if parts[0] == id:
                    file.write(f"{parts[0]},{parts[1]},{category.strip().lower()}\n")
                else:
                    file.write(line + "\n")
                index += 1
            file.close()
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating tag: {str(e)}")
