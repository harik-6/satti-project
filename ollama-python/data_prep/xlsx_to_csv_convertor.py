import pandas as pd
import os
from pathlib import Path

def convert_xlsx_to_csv(xlsx_file_path, csv_output_dir, csv_filename=None):
    try:
        # Read the Excel file
        print(f"Reading Excel file: {xlsx_file_path}")
        df = pd.read_excel(xlsx_file_path)

        # Create output directory if it doesn't exist
        os.makedirs(csv_output_dir, exist_ok=True)

        # Generate CSV filename if not provided
        if csv_filename is None:
            xlsx_name = Path(xlsx_file_path).stem  # Get filename without extension
            csv_filename = f"{xlsx_name}.csv"

        # Create full path for CSV file
        csv_file_path = os.path.join(csv_output_dir, csv_filename)

        # Convert to CSV
        print(f"Converting to CSV: {csv_file_path}")
        df.to_csv(csv_file_path, index=False)

        print(f"Successfully converted {xlsx_file_path} to {csv_file_path}")
        print(f"CSV file contains {len(df)} rows and {len(df.columns)} columns")

        return csv_file_path

    except FileNotFoundError:
        print(f"Error: Excel file not found at {xlsx_file_path}")
        return None
    except Exception as e:
        print(f"Error converting file: {str(e)}")
        return None

if __name__ == "__main__":
    convert_xlsx_to_csv("data_prep/mf_data_from_moneycontrol/Historic.xlsx", "mf_data_csv")
    convert_xlsx_to_csv("data_prep/mf_data_from_moneycontrol/Risk_Ratio.xlsx", "mf_data_csv")
