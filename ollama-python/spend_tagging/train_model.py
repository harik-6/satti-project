import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer

def main():
    sample_training_data = {
        'narration': [
            "UPI-BB HELMET ACCESSOR-GPAY",
            "NEFT DR-UTIB0002097-HARIPRASAD K-NETBANK-SALARY TRANSFER",
            "ZOMATO ORDER DINE-IN RESTAURANT",
            "SWIGGY FOOD DELIVERY-PIZZA",
            "FLIPKART ONLINE SHOPPING-CLOTHES",
            "AMAZON PRIME VIDEO SUBSCRIPTION",
            "RENT PAYMENT - FLAT APARTMENT",
            "ELECTRICITY BILL PAYMENT",
            "GROCERY SUPERMART PURCHASE",
            "VEGETABLES AND FRUITS MARKET",
            "PAYTM MOBILE RECHARGE",
            "DOMINOS PIZZA OUTLET",
            "MYNTRA FASHION HAUL",
            "WATER BILL DUE",
            "STARBUCKS COFFEE CAFE",
            "GYM MEMBERSHIP MONTHLY",
            "BUS TICKET TRAVEL",
            "FUEL STATION PETROL DIESEL",
            "CREDIT CARD BILL PAYMENT",
            "SALARY DEPOSIT - ABC CORP",
            "LIC PREMIUM DEDUCTION",  # This category 'Insurance' has only 1 instance
            "MUNICIPAL TAX PAYMENT",  # This category 'Taxes' has only 1 instance
            "BOOK STORE PURCHASE",  # This category 'Leisure' has only 1 instance
            "CAB RIDE UBER OLA"
        ],
        'category': [
            'Shopping', 'Income', 'Food', 'Food', 'Shopping', 'Subscription', 'Rent',
            'Utility', 'Groceries', 'Groceries', 'Utility', 'Food', 'Shopping',
            'Utility', 'Food', 'Health & Fitness', 'Travel', 'Transport',
            'Bill Payment', 'Income', 'Insurance', 'Taxes', 'Leisure', 'Travel'
        ]
    }

    df = pd.DataFrame(sample_training_data)
    tfidf_vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    X = tfidf_vectorizer.fit_transform(df['narration']).toarray()
    y = df['category']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)
    print("\n--- Predicting on New Data ---")
    new_transactions = [
        "GROCERIES DAILY ESSENTIALS",
        "UPI TRANSFER TO FRIEND FOR FOOD",
        "EMI LOAN PAYMENT",
        "NEW MOBILE PHONE PURCHASE",
        "LIFE INSURANCE POLICY RENEWAL"  # Test the 'Insurance' category
    ]
    new_narration_features = tfidf_vectorizer.transform(new_transactions).toarray()
    predicted_categories = model.predict(new_narration_features)
    for i, transaction in enumerate(new_transactions):
        print(f"Transaction: '{transaction}' -> Predicted Category: '{predicted_categories[i]}'")

if __name__ == '__main__':
    main()