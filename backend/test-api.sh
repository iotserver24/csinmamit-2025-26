#!/bin/bash

# CSI NMAMIT Backend API Test Script
# This script tests all the main API endpoints

BASE_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "  CSI NMAMIT Backend API Tests"
echo "======================================"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "$body" | jq '.'
else
    echo -e "${RED}✗ Health check failed${NC}"
    echo "$body"
fi
echo ""

# Test 2: Create Order
echo -e "${YELLOW}Test 2: Create Payment Order${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/payments/create-order" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user_123",
    "planId": "annual",
    "amount": 50000,
    "transactionId": "TXN_TEST_'$(date +%s)'",
    "formData": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9876543210",
      "branch": "Computer Science",
      "year": "3",
      "usn": "4NM21CS001"
    }
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 201 ]; then
    echo -e "${GREEN}✓ Order creation passed${NC}"
    echo "$body" | jq '.'
    ORDER_ID=$(echo "$body" | jq -r '.data.orderId')
    echo "Order ID: $ORDER_ID"
else
    echo -e "${RED}✗ Order creation failed${NC}"
    echo "$body" | jq '.'
fi
echo ""

# Test 3: Invalid Order (Missing fields)
echo -e "${YELLOW}Test 3: Create Order - Validation Test${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/payments/create-order" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "amount": 100
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 400 ]; then
    echo -e "${GREEN}✓ Validation test passed (correctly rejected invalid data)${NC}"
    echo "$body" | jq '.'
else
    echo -e "${RED}✗ Validation test failed${NC}"
    echo "$body"
fi
echo ""

# Test 4: Get Order Details (if order was created)
if [ ! -z "$ORDER_ID" ]; then
    echo -e "${YELLOW}Test 4: Get Order Details${NC}"
    response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/payments/order/${ORDER_ID}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✓ Get order details passed${NC}"
        echo "$body" | jq '.'
    else
        echo -e "${RED}✗ Get order details failed${NC}"
        echo "$body"
    fi
    echo ""
fi

# Test 5: 404 Test
echo -e "${YELLOW}Test 5: 404 Not Found Test${NC}"
response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/nonexistent")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 404 ]; then
    echo -e "${GREEN}✓ 404 handling works correctly${NC}"
    echo "$body" | jq '.'
else
    echo -e "${RED}✗ 404 handling failed${NC}"
    echo "$body"
fi
echo ""

# Summary
echo "======================================"
echo "  Test Summary"
echo "======================================"
echo "All basic API tests completed."
echo ""
echo "Note: Payment verification tests require actual Razorpay payment flow."
echo "Use the frontend application to test end-to-end payment processing."
echo ""
