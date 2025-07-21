from mftool import Mftool
mf = Mftool()

async def generate_portfolio_summary(fund_list):
    portfolio_summary = []
    for fund in fund_list:
        matching_schemes = mf.get_available_schemes(fund)
        for key, value in matching_schemes.items():
            if "direct" in value.lower() and "growth" in value.lower():
                selected = key
                mf_response = mf.get_scheme_quote(selected)
                portfolio_summary.append(mf_response)
    return portfolio_summary