#!/bin/bash

API_KEY=$MOLLIE_API_KEY

# Fetch all payments
response=$(curl -s -X GET "https://api.mollie.com/v2/payments" -H "Authorization: Bearer $MOLLIE_API_KEY")

# Count total payments
total=$(echo "$response" | jq '[.["_embedded"].payments[]] | length')

# Count successful payments
successful=$(echo "$response" | jq '[.["_embedded"].payments[] | select(.status == "paid")] | length')

# Calculate conversion rate
if [[ "$total" -gt 0 ]]; then
    conversion_rate=$(echo "scale=2; ($successful / $total) * 100" | bc)
else
    conversion_rate=0
fi

echo "Total Payments: $total"
echo "Successful Payments: $successful"
echo "Conversion Rate: $conversion_rate%"
