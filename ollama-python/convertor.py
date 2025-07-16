import json
import re

def convert_hdfc_statement_to_transactions(hdfc_text_file):
    try:
        if isinstance(hdfc_text_file, str):
            with open(hdfc_text_file, 'r', encoding='utf-8') as file:
                content = file.read()
        else:
            content = hdfc_text_file

        lines = [line.strip() for line in content.split('\n') if line.strip()]


        if not lines:
            return json.dumps({"error": "No data found in file"})

        header_line = None
        data_start_index = 0
        for i, line in enumerate(lines):
            if ',' in line and 'Date' in line:
                header_line = line
                data_start_index = i + 1
                break

        if not header_line:
            return json.dumps({"error": "Header line not found"})

        headers = [col.strip() for col in header_line.split(',')]

        fields_to_exclude = ["Value Dat", "Chq/Ref Number", "Closing Balance"]

        transactions = []
        for line in lines[data_start_index:]:
            if not line.strip():
                continue

            values = [val.strip() for val in line.split(',')]

            if len(values) != len(headers):
                continue

            transaction = {}
            for i, header in enumerate(headers):
                if header in fields_to_exclude:
                    continue

                value = values[i] if i < len(values) else ""

                if 'Amount' in header or 'Balance' in header:
                    cleaned_value = re.sub(r'[^\d.-]', '', value)
                    try:
                        transaction[header] = float(cleaned_value) if cleaned_value else 0.0
                    except ValueError:
                        transaction[header] = value
                else:
                    transaction[header] = value

            transactions.append(transaction)

        return transactions

    except Exception as e:
        return json.dumps({"error": f"Error converting file: {str(e)}"})