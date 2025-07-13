import pandas as pd
import os

def combine_all_csv_files(csv_dir, primary_column, output_filename):
    try:
        # Define columns to ignore during combination
        columns_to_ignore = [
            'Plan', 'Category Name', 'Crisil Rank', 'Crisil Rating',
            '% Equity Holding', 'No of stocks in portfolio', '% Debt Holding',
            'No of debt holdings', '% MF Holding', '% Cash Holding', '% Other Holding',
            '2024', '2024.0', '2023', '2023.0', '2022', '2022.0', '2021', '2020',
            '2019', '2018', '2017', '2016', '2015', '2014'
        ]

        csv_files = [f for f in os.listdir(csv_dir) if f.endswith('.csv')]
        first_file = os.path.join(csv_dir, csv_files[0])
        combined_df = pd.read_csv(first_file)

        if primary_column not in combined_df.columns:
            raise ValueError(f"Primary column '{primary_column}' not found in {csv_files[0]}")

        # Remove ignored columns from the first dataframe
        cols_to_drop = [col for col in columns_to_ignore if col in combined_df.columns]
        if cols_to_drop:
            combined_df = combined_df.drop(columns=cols_to_drop)
            print(f"Removed columns from first file: {cols_to_drop}")

        # Combine with each subsequent file
        for i, csv_file in enumerate(csv_files[1:], 1):
            file_path = os.path.join(csv_dir, csv_file)
            next_df = pd.read_csv(file_path)

            if primary_column not in next_df.columns:
                continue

            # Remove ignored columns from this dataframe
            cols_to_drop = [col for col in columns_to_ignore if col in next_df.columns]
            if cols_to_drop:
                next_df = next_df.drop(columns=cols_to_drop)
                print(f"Removed columns from {csv_file}: {cols_to_drop}")

            # Handle duplicate columns (keep from combined_df, remove from next_df)
            duplicate_cols = set(combined_df.columns) & set(next_df.columns) - {primary_column}
            if duplicate_cols:
                next_df = next_df.drop(columns=list(duplicate_cols))

            # Merge with the combined dataframe
            combined_df = pd.merge(combined_df, next_df, on=primary_column, how='outer')

        # Reorder columns to put primary column first
        cols = [primary_column] + [col for col in combined_df.columns if col != primary_column]
        combined_df = combined_df[cols]

        # Save combined CSV
        combined_df.to_csv(output_filename, index=False)
        print(f"\n🎉 Successfully combined all CSV files!")
        return combined_df

    except Exception as e:
        print(f"❌ Error combining all CSV files: {str(e)}")
        return None

def format_value(value):
    """Format a value for display, handling NaN, empty strings, and dashes"""
    if pd.isna(value) or value == '' or value == '-':
        return "N/A"
    return str(value)

def write_formatted_output(df, output_filename):
    """Write the combined data with all columns from CSV"""
    try:
        formatted_lines = []

        for _, row in df.iterrows():
            formatted_parts = []

            # Add all columns from the CSV
            for column in df.columns:
                value = format_value(row.get(column, ''))
                # Clean up column names for display
                clean_column = column.replace('_', ' ').replace('.0', '').strip()
                formatted_parts.append(f"{clean_column}: {value}")

            # Join all parts
            formatted_line = ", ".join(formatted_parts)
            formatted_lines.append(formatted_line)

        # Write to file
        with open(output_filename, 'w', encoding='utf-8') as f:
            for line in formatted_lines:
                f.write(line + '\n')

        print(f"\n📝 Successfully wrote {len(formatted_lines)} formatted entries to {output_filename}")
        return True

    except Exception as e:
        print(f"❌ Error writing formatted output: {str(e)}")
        return False

if __name__ == "__main__":
    print("\nCombining ALL CSV files from mf_data_csv folder...")
    combined_df = combine_all_csv_files(
        csv_dir="data_prep/mf_data_csv",
        primary_column="Scheme Name",
        output_filename="data_prep/data.csv"
    )

    if combined_df is not None:
        print("\nWriting formatted output...")
        write_formatted_output(
            df=combined_df,
            output_filename="data_prep/data.txt"
        )