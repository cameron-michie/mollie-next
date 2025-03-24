Orders API

  Creating an order

    send_post "https://api.mollie.com/v2/orders" \
       $MOLLIE_API_KEY \
       "order.json" \
       "order_response.json"

     curlie -X POST "https://api.mollie.com/v2/orders" \   
        -H "Authorization: Bearer $MOLLIE_API_KEY" \
        -H "Content-Type: application/json" \
        -d order.json

    
  Listing orders
    curlie -X GET "https://api.mollie.com/v2/orders?limit=5" \
        -H "Authorization: Bearer $MOLLIE_API_KEY" \

     List just order ids
    curlie -X GET "https://api.mollie.com/v2/orders?limit=5" \
        -H "Authorization: Bearer $MOLLIE_API_KEY" | jq '._embedded.orders[].id'

  To pay for an order use the following endpoint with the orderId substitued
    curlie -X POST https://api.mollie.com/v2/orders/ord_1.c32r9s/payments \
        -H "Authorization: Bearer $MOLLIE_API_KEY"


Methods API

  List payment methods for a country
    For GB
    curlie -X GET "https://api.mollie.com/v2/methods/all?amount%5Bvalue%5D=100.00&amount%5Bcurrency%5D=GBP&locale=en_GB" \
        -H "Authorization: Bearer $MOLLIE_API_KEY" | jq '._embedded.methods[] | {id, description}'
    
  For NL
  curlie -X GET "https://api.mollie.com/v2/methods/all?amount%5Bvalue%5D=100.00&amount%5Bcurrency%5D=EUR&locale=nl_NL" \
      -H "Authorization: Bearer $MOLLIE_API_KEY" | jq '._embedded.methods[] | {id, description}'


Payments API

  Create payment
     send_post "https://api.mollie.com/v2/payments" \
        $MOLLIE_API_KEY \
        "payment.json" \
        "payment_response.json"

  List payments
    curlie -X GET "https://api.mollie.com/v2/payments?limit=5" \
        -H "Authorization: Bearer $MOLLIE_API_KEY"
        
  Conversion rate of payments
    sh conversion_rate.sh

  To return the list payments in a more useful form
    curlie -s -X GET "https://api.mollie.com/v2/payments" \
      -H "Authorization: Bearer $MOLLIE_API_KEY" |
      jq '.["_embedded"].payments[] |
      {id, status, amount: .amount.value, currency: .amount.currency, method, description, createdAt, paidAt}'
