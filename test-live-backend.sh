#!/bin/bash

# Test Live Backend Routes
BACKEND_URL="https://online-study-platform-msde.onrender.com"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           Testing Live Backend Routes                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s "$BACKEND_URL/health" | jq -r '.message'
echo ""

# Test 2: Root Endpoint
echo "2. Testing Root Endpoint..."
curl -s "$BACKEND_URL/" | jq -r '.message'
echo ""

# Test 3: Categories
echo "3. Testing Categories API..."
curl -s "$BACKEND_URL/api/v1/course/showAllCategories" | jq '{success, totalCategories: (.data | length)}'
echo ""

# Test 4: All Courses
echo "4. Testing All Courses API..."
curl -s "$BACKEND_URL/api/v1/course/getAllCourses" | jq '{success, totalCourses: (.data | length)}'
echo ""

# Test 5: Reviews
echo "5. Testing Reviews API..."
curl -s "$BACKEND_URL/api/v1/course/getReviews" | jq '{success, totalReviews: (.data | length)}'
echo ""

# Test 6: Category Details
echo "6. Testing Category Details API..."
curl -s -X POST "$BACKEND_URL/api/v1/course/getCategoryPageDetails" \
  -H "Content-Type: application/json" \
  -d '{"categoryId": "696923908bbe6bb533f64704"}' | jq '{success, category: .data.selectedCategory.name}'
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    Tests Complete!                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
