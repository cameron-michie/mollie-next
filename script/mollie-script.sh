#!/bin/bash

# Mollie API Key (Use test mode for demo)
API_KEY="test_Ua9EmCuR68sRkjUT29KQGuM4Ur5xwQ

# # JSON file storage
# ORDER_JSON="order.json"
# PAYMENT_JSON="payment.json"

# # Function to pause for user confirmation
# function wait_for_user() {
#     read -p "Press enter to continue..."
# }

# # Function to send a request and preview
# function send_request() {
#     local url="$1"
#     local json_file="$2"
#     local output_file="$3"
    
#     echo -e "\nSending Request to: $url"
#     echo "Payload: $(cat $json_file)"
#     wait_for_user
#     curl -s -X POST "$url" \
#         -H "Authorization: Bearer $API_KEY" \
#         -H "Content-Type: application/json" \
#         -d @"$json_file" | tee "$output_file"
# }

# # Step 1: Define Shopping Cart and Address
# echo "Step 1: Defining Shopping Cart and Address"

# # cat > "$ORDER_JSON" <<EOF
# # {
# #     "amount": {
# #         "currency": "EUR",
# #         "value": "49.99"
# #     },
# #     "orderNumber": "123456",
# #     "lines": [
# #         {
# #             "name": "Demo Product",
# #             "quantity": 1,
# #             "unitPrice": {
# #                 "currency": "EUR",
#                 "value": "49.99"
#             },
#             "totalAmount": {
#                 "currency": "EUR",
#                 "value": "49.99"
#             }
#         }
#     ],
#     "billingAddress": {
#         "givenName": "John",
#         "familyName": "Doe",
#         "email": "john.doe@example.com",
#         "streetAndNumber": "123 Demo Street",
#         "city": "Amsterdam",
#         "country": "NL"
#     },
#     "redirectUrl": "https://yourwebsite.com/order-success",
#     "webhookUrl": "https://yourserver.com/webhook"
# }
# EOF

# echo "Shopping cart and address defined."
# wait_for_user

# # Step 2: Fetch Available Payment Methods
# echo "Step 2: Fetching Available Payment Methods"

# curl -s -X GET "https://api.mollie.com/v2/methods" \
#     -H "Authorization: Bearer $API_KEY" | tee methods.json

# wait_for_user

# # Step 3: Create an Order
# echo "Step 3: Creating Order"
# send_request "https://api.mollie.com/v2/orders" "$ORDER_JSON" "created_order.json"

# ORDER_ID=$(jq -r '.id' created_order.json)

# if [[ -z "$ORDER_ID" || "$ORDER_ID" == "null" ]]; then
#     echo "Error: Could not retrieve order ID!"
#     exit 1
# fi

# Step 4: Fetch Payment Link
# echo "Step 4: Fetching Payment Link"

# curl -s -X GET "https://api.mollie.com/v2/orders/$ORDER_ID" \
#     -H "Authorization: Bearer $API_KEY" | tee order_details.json

# PAYMENT_LINK=$(jq -r '.links.checkout.href' order_details.json)

# if [[ -z "$PAYMENT_LINK" || "$PAYMENT_LINK" == "null" ]]; then
#     echo "Error: No payment link found!"
#     exit 1
# fi

# echo "Payment link: $PAYMENT_LINK"
# echo "Open the link in your browser to proceed with payment."

# wait_for_user

# # Step 5: Handle Payment Completion
# echo "Step 5: Checking Payment Status"

# curl -s -X GET "https://api.mollie.com/v2/orders/$ORDER_ID" \
#     -H "Authorization: Bearer $API_KEY" | tee order_status.json

# STATUS=$(jq -r '.status' order_status.json)

# if [[ "$STATUS" == "paid" ]]; then
#     echo "Payment successful! Order is paid."
# else
#     echo "Payment status: $STATUS. Waiting for completion..."
# fi

# wait_for_user
