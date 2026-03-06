const fs = require('fs');

const BASE_URL = 'http://localhost:8001/api';

async function testAPIs() {
  const results = [
    ['Method', 'Endpoint', 'Request Body', 'Headers', 'Status Code', 'Response Body']
  ];

  async function call(method, endpoint, body = null, headers = {}) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const json = await response.json();
      results.push([
        method,
        endpoint,
        body ? JSON.stringify(body) : 'N/A',
        JSON.stringify(headers),
        response.status,
        JSON.stringify(json)
      ]);
      return json;
    } catch (err) {
      results.push([
        method,
        endpoint,
        body ? JSON.stringify(body) : 'N/A',
        JSON.stringify(headers),
        'ERROR',
        err.message
      ]);
      return null;
    }
  }

  // 1. Register Admin
  console.log('Testing Admin Registration...');
  await call('POST', '/admin/register', {
    name: 'Jaydip Admin',
    email: 'jaydip@test.com',
    password: 'password123',
    role: 'admin'
  });

  // 2. Login Admin
  console.log('Testing Admin Login...');
  const adminLogin = await call('POST', '/admin/login', {
    email: 'jaydip@test.com',
    password: 'password123'
  });

  const adminToken = adminLogin && adminLogin.token;
  const adminHeaders = adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {};

  // 3. Add Manager
  console.log('Testing Add Manager...');
  await call('POST', '/manager/addManagers', {
    name: 'Manager One',
    email: 'manager1@test.com',
    password: 'password123',
    role: 'manager'
  }, adminHeaders);

  // 4. Manager Login
  console.log('Testing Manager Login...');
  const managerLogin = await call('POST', '/manager/managerLogin', {
    email: 'manager1@test.com',
    password: 'password123'
  });
  const managerToken = managerLogin && managerLogin.token;
  const managerHeaders = managerToken ? { 'Authorization': `Bearer ${managerToken}` } : {};

  // 5. Add Employee
  console.log('Testing Add Employee...');
  await call('POST', '/employee/addEmployee', {
    name: 'Employee One',
    email: 'employee1@test.com',
    password: 'password123',
    role: 'employee'
  }, managerHeaders);

  // 6. Get Admin Profile
  console.log('Testing Admin Profile...');
  await call('GET', '/admin/myProfile', null, adminHeaders);

  // 7. Get All Managers
  console.log('Testing All Managers...');
  await call('GET', '/manager/allManagers', null, adminHeaders);

  // 8. Get All Employees
  console.log('Testing All Employees...');
  await call('GET', '/employee/allEmployees', null, managerHeaders);

  // Convert results to CSV
  const csvContent = results.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  fs.writeFileSync('api_test_results.csv', csvContent);
  console.log('Results saved to api_test_results.csv');
}

testAPIs();
