def get_rule_file(file_name):
    try:
        with open(f"rules_files/{file_name}", "r", encoding="utf-8") as file:
            content = file.read()
        return content
    except Exception as e:
        return e

def update_rule_file(file_name, content):
    try:
        with open(f"rules_files/{file_name}", "w", encoding="utf-8") as file:
            file.write(content)
        return "success"
    except Exception as e:
        return e