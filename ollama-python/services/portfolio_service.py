from mftool import Mftool
import json
from datetime import datetime, timedelta

mf = Mftool()
MF_CODES_FILE = "mf_codes.json"
VALID_FUND_HOUSES = ["Axis", "SBI", "Nippon", "HDFC", "ICICI", "UTI"]
PURCHASE_UNIT = 10

async def download_data():
    fund_house_names = ["Axis", "SBI", "Nippon", "HDFC", "ICICI", "UTI"]
    fund_details = []
    for house in fund_house_names:
        matching_schemes = mf.get_available_schemes(house)
        for key, value in matching_schemes.items():
            fund_details.append({
                "schemeCode": key,
                "schemeName": value
            })

    with open(MF_CODES_FILE, "w") as file:
        json.dump(fund_details, file, indent=2)
    return ""

def get_available_schemes(fund_name):
    filtered_list = []
    with open(MF_CODES_FILE, "r") as file:
        fund_details = json.load(file)

    for fund in fund_details:
        index = fund["schemeName"].find(fund_name)
        if index != -1:
            filtered_list.append(fund)

    return filtered_list

def filter_last_3_years_data(scheme_data):
    if not scheme_data or 'data' not in scheme_data:
        return scheme_data

    cutoff_date = datetime.now() - timedelta(days=3*365)
    monthly_data = {}

    for record in scheme_data['data']:
        if 'date' in record:
            try:
                date_str = record['date']
                date_obj = None

                for date_format in ['%d-%m-%Y', '%d/%m/%Y', '%Y-%m-%d', '%m/%d/%Y']:
                    try:
                        date_obj = datetime.strptime(date_str, date_format)
                        break
                    except ValueError:
                        continue

                if date_obj and date_obj >= cutoff_date:
                    month_year_key = f"{date_obj.year}-{date_obj.month:02d}"

                    if month_year_key not in monthly_data or date_obj > monthly_data[month_year_key]['date_obj']:
                        monthly_data[month_year_key] = {
                            'record': record,
                            'date_obj': date_obj
                        }
            except Exception as e:
                print(f"Warning: Could not parse date '{record.get('date', 'N/A')}': {e}")

    filtered_data = []
    for month_data in monthly_data.values():
        filtered_data.append(month_data['record'])

    def get_date_obj(record):
        date_str = record['date']
        for date_format in ['%d-%m-%Y', '%d/%m/%Y', '%Y-%m-%d', '%m/%d/%Y']:
            try:
                return datetime.strptime(date_str, date_format)
            except ValueError:
                continue
        return datetime.min

    filtered_data.sort(key=get_date_obj, reverse=True)

    filtered_scheme_data = scheme_data.copy()
    filtered_scheme_data['data'] = filtered_data

    return filtered_scheme_data

def calculate_profile_and_lost(scheme_data):
    if not scheme_data or 'data' not in scheme_data:
        return scheme_data
    last_3_year_nav = scheme_data['data']
    total_invested_value = 0
    total_purchased_units = 0
    for data in last_3_year_nav[1:]:
        total_invested_value += float(data['nav']) * PURCHASE_UNIT
        total_purchased_units += PURCHASE_UNIT
    total_current_value = float(last_3_year_nav[0]['nav']) * total_purchased_units
    profit_loss_perc = ((total_current_value - total_invested_value) / total_invested_value) * 100
    scheme_data['total_invested_value'] = total_invested_value
    scheme_data['total_current_value'] = total_current_value
    scheme_data['profit_loss_perc'] = profit_loss_perc
    return scheme_data

async def generate_portfolio_summary(fund_list):
    portfolio_summary = []

    filtered_fund_list = []
    for fund_name in fund_list:
        for house in VALID_FUND_HOUSES:
            if fund_name.strip().lower().startswith(house.lower()):
                filtered_fund_list.append(fund_name)
                break

    for fund_name in filtered_fund_list:
        found_direct_growth = False
        if len(fund_name) > 3:
            fund_name_short = " ".join(fund_name.split(" ")[0:3])
            matching_schemes_list = get_available_schemes(fund_name_short.strip())
            for obj in matching_schemes_list:
                key = obj["schemeCode"]
                value = obj["schemeName"]
                if "direct" in value.lower() and "growth" in value.lower():
                    print(f"Direct and Growth fund we got: {value}")
                    found_direct_growth = True
                    selected = key
                    scheme_data = mf.get_scheme_historical_nav(selected)
                    filtered_scheme_data = filter_last_3_years_data(scheme_data)
                    data_with_pl = calculate_profile_and_lost(filtered_scheme_data)
                    portfolio_summary.append(data_with_pl)
            if not found_direct_growth:
                for obj in matching_schemes_list:
                    key = obj["schemeCode"]
                    value = obj["schemeName"]
                    if "direct" in value.lower():
                        print(f"Direct and Growth not fund, but direct we got: {value}")
                        selected = key
                        scheme_data = mf.get_scheme_historical_nav(selected)
                        filtered_scheme_data = filter_last_3_years_data(scheme_data)
                        data_with_pl = calculate_profile_and_lost(filtered_scheme_data)
                        portfolio_summary.append(data_with_pl)
    return portfolio_summary