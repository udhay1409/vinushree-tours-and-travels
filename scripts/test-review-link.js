// Simple test to check if review link is working
const testReviewLink = 'http://localhost:3000/review?token=review_68b83e5d3a6bcb214d6540a1_1756905182187_bosv2do3o';

console.log('Test Review Link:', testReviewLink);
console.log('\nTo test:');
console.log('1. Copy the link above');
console.log('2. Open it in a new browser tab');
console.log('3. Fill out the review form');
console.log('4. Submit the review');
console.log('5. Check admin testimonials for the new review');

// You can also test this programmatically
async function testReviewAPI() {
  try {
    // Test GET request to validate token
    const response = await fetch(`http://localhost:3000/api/review?token=review_68b83e5d3a6bcb214d6540a1_1756905182187_bosv2do3o`);
    const result = await response.json();
    
    console.log('\nAPI Test Result:', result);
    
    if (result.success) {
      console.log('✅ Review link is valid and working!');
      console.log('Customer:', result.data.customerName);
      console.log('Service:', result.data.serviceType);
    } else {
      console.log('❌ Review link validation failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing review API:', error.message);
  }
}

// Uncomment the line below to test the API
// testReviewAPI();