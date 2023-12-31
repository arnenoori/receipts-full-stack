## Example Flow 1: User Logs a Purchase

**Scenario:** Alice wants to sign up and log her first transactions and purchases.

1. **Instantiate the user**
    ```json
    POST /user
    {
      "name": "Alice",
      "email": "alice@example.com"
    }
    ```

2. **Manually add a transaction**
    ```json
    POST /user/{user_id}/transactions
    {
      "merchant": "Amazon",
      "description": "Book Purchase"
    }
    ```

3. **Manually add another transaction**
    ```json
    POST /user/{user_id}/transactions
    {
      "merchant": "Walmart",
      "description": "Groceries"
    }
    ```

4. **Manually add a purchase**
    ```json
    POST /user/{user_id}/transactions/{transaction_id}/purchases
    {
      "item": "Novel",
      "price": 15.99,
      "category": "Books",
      "warranty_date": "2025-05-01",
      "return_date": "2023-12-15"
    }
    ```

5. **Retrieve her transactions**
    ```json
    GET /user/{user_id}/transactions
    ```

6. **Retrieve her purchases**
    ```json
    GET /user/{user_id}/transactions/{transaction_id}/purchases
    ```


# Testing Results 

## 1.1 Curl statement

```json
curl -X 'POST' \
  'https://test-webapp-0law.onrender.com/user/' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Alice",
  "email": "alice@example.com"
}'
```

## 1.2 Response received

```json
{
  "user_id": 3
}
```

## 2.1 Curl Statement
```json
curl -X 'POST' \
  'https://test-webapp-0law.onrender.com/user/3/transactions/' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf' \
  -H 'Content-Type: application/json' \
  -d '{
  "merchant": "Amazon",
  "description": "Book Purchase"
}'
```

## 2.2 Response Received
```json
{
  "transaction_id": 3
}
```

## 3.1 Curl Statement
```json
curl -X 'POST' \
  'https://test-webapp-0law.onrender.com/user/3/transactions/' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf' \
  -H 'Content-Type: application/json' \
  -d '{
  "merchant": "Walmart",
  "description": "Groceries"
}'
```

## 3.2 Response Received
```json
{
  "transaction_id": 4
}
```

## 4.1 Curl Statement
```json
curl -X 'POST' \
  'https://test-webapp-0law.onrender.com/user/3/transactions/3/purchases/' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf' \
  -H 'Content-Type: application/json' \
  -d '{
  "item": "Novel",
  "price": 15.99,
  "category": "Books",
  "warranty_date": "2025-05-01",
  "return_date": "2025-05-01"
}'
```

## 4.2 Response Received
```json
{
  "purchase_id": 4
}
```

## 5.1 Curl Statement
```json
curl -X 'GET' \
  'https://test-webapp-0law.onrender.com/user/3/transactions/' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf'
```

## 5.2 Response Received
```json
[
  {
    "merchant": "Amazon",
    "description": "Book Purchase",
    "created_at": "2023-10-31T04:01:39.730508+00:00"
  },
  {
    "merchant": "Walmart",
    "description": "Groceries",
    "created_at": "2023-10-31T04:02:14.904650+00:00"
  }
]
```

## 6.1 Curl Statement
```json
curl -X 'GET' \
  'https://test-webapp-0law.onrender.com/user/3/purchases/?transaction_id=3' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf'
```

## 6.2 Response Received
```json
[
  {
    "item": "Novel",
    "price": 15.99,
    "category": "Books",
    "warranty_date": "2025-05-01",
    "return_date": "2025-05-01"
  }
]
```

## Example Flow 2: User Updates a Purchase

**Scenario:** Alice wants to update her puchases and transactions. We assume Alice has already been instantiated.


1. **Retrieve her transactions**
    ```json
    GET /user/{user_id}/transactions
    ```

2. **Retrieve her purchases**
    ```json
    GET /user/{user_id}/transactions/{transaction_id}/purchases
    ```

3. **Updates her transactions**
    ```json
    PUT /user/{user_id}/transactions/{transaction_id}
    ```

4. **Updates her purchases**
    ```json
    PUT /user/{user_id}/transactions/{transaction_id}/purchases{purchase_id}
    ```


# Testing Results 


## 1.1 Curl Statement
```json
curl -X 'GET' \
  'https://test-webapp-0law.onrender.com/user/3/transactions/' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf'
```

## 1.2 Response Received
```json
[
  {
    "merchant": "Amazon",
    "description": "Book Purchase",
    "created_at": "2023-10-31T04:01:39.730508+00:00"
  },
  {
    "merchant": "Walmart",
    "description": "Groceries",
    "created_at": "2023-10-31T04:02:14.904650+00:00"
  }
]
```

## 2.1 Curl Statement
```json
curl -X 'GET' \
  'https://test-webapp-0law.onrender.com/user/3/purchases/?transaction_id=3' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf'
```

## 2.2 Response Received
```json
[
  {
    "item": "Novel",
    "price": 15.99,
    "category": "Books",
    "warranty_date": "2025-05-01",
    "return_date": "2025-05-01"
  }
]
```

## 3.1 Curl Statement
```json
curl -X 'PUT' \
  'https://test-webapp-0law.onrender.com/user/3/transactions/3' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf' \
  -H 'Content-Type: application/json' \
  -d '{
  "merchant": "Trader Joe's",
  "description": "groceries"
}'
```

## 3.2 Response Received
```json
{
  "merchant": "Trader Joe's",
  "description": "groceries"
}
```

## 4.1 Curl Statement
```json
curl -X 'PUT' \
  'https://test-webapp-0law.onrender.com/user/3/purchases/4?transaction_id=3' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf' \
  -H 'Content-Type: application/json' \
  -d '{
  "item": "Chips",
  "price": 5,
  "category": "snacks",
  "warranty_date": "10-10-2030",
  "return_date": "10-10-2023"
}'
```

## 4.2 Response Received
```json
{
  "item": "Chips",
  "price": 5,
  "category": "snacks",
  "warranty_date": "10-10-2030",
  "return_date": "10-10-2023"
}
```

# Example Workflow

## Example Flow 3: User Deletes Purchase/Transaction and deletes their user identity

**Scenario:** Alice wants delete a purchase and transaction. Then, she wants to delete her entire user. We assume Alice has already been instantiated.


1. **Retrieve her transactions**
    ```json
    GET /user/{user_id}/transactions
    ```

2. **Retrieve her purchases**
    ```json
    GET /user/{user_id}/transactions/{transaction_id}/purchases
    ```

3. **Delete a transaction**
    ```json
    DELETE /user/{user_id}/transactions/{transaction_id}
    ```

4. **Delete a purchase**
    ```json
    DELETE /user/{user_id}/transactions/{transaction_id}/purchases{purchase_id}
    ```

5. **Delete Alice**
    ```json
    DELETE /user/{user_id}
    ```


# Testing Results 


## 1.1 Curl Statement
```json
curl -X 'GET' \
  'https://test-webapp-0law.onrender.com/user/3/transactions/' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf'
```

## 1.2 Response Received
```json
[
  {
    "merchant": "Amazon",
    "description": "Book Purchase",
    "created_at": "2023-10-31T04:01:39.730508+00:00"
  },
  {
    "merchant": "Walmart",
    "description": "Groceries",
    "created_at": "2023-10-31T04:02:14.904650+00:00"
  }
]
```

## 2.1 Curl Statement
```json
curl -X 'GET' \
  'https://test-webapp-0law.onrender.com/user/3/purchases/?transaction_id=3' \
  -H 'accept: application/json' \
  -H 'access_token: 24tkvO0BQSYaWtDf'
```

## 2.2 Response Received
```json
[
  {
    "item": "Novel",
    "price": 15.99,
    "category": "Books",
    "warranty_date": "2025-05-01",
    "return_date": "2025-05-01"
  }
]
```

## 3.1 Curl Statement
```json
curl -X 'DELETE' \
  'https://test-webapp-0law.onrender.com/user/3/transactions/3' \
  -H 'accept: application/json'
```

## 3.2 Response Received
```json
"OK"
```

## 4.1 Curl Statement
```json
curl -X 'DELETE' \
  'https://test-webapp-0law.onrender.com/user/3/purchases/4?transaction_id=3' \
  -H 'accept: application/json'
```

## 4.2 Response Received
```json
"OK"
```

## 5.1 Curl Statement
```json
curl -X 'DELETE' \
  'https://test-webapp-0law.onrender.com/user/5' \
  -H 'accept: application/json'
```

## 5.2 Response Received
```json
"OK"
```