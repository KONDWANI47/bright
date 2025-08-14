import requests
import sys
import json
from datetime import datetime

class SchoolManagementAPITester:
    def __init__(self, base_url="https://learnhub-122.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_student_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if method == 'GET' and 'students' in endpoint and endpoint.endswith('students'):
                        print(f"   Found {len(response_data)} students")
                    elif method == 'POST' and 'students' in endpoint:
                        print(f"   Created student with ID: {response_data.get('id', 'N/A')}")
                    elif 'stats' in endpoint:
                        print(f"   Total students: {response_data.get('total_students', 0)}")
                        print(f"   Classes: {len(response_data.get('class_distribution', []))}")
                except:
                    pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text}")

            return success, response.json() if response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success

    def test_get_students_empty(self):
        """Test getting students when database might be empty"""
        success, response = self.run_test(
            "Get Students (Initial)",
            "GET",
            "api/students",
            200
        )
        return success, response

    def test_create_student(self, student_data):
        """Create a student"""
        success, response = self.run_test(
            f"Create Student - {student_data['firstName']} {student_data['lastName']}",
            "POST",
            "api/students",
            201,  # POST should return 201 for creation
            data=student_data
        )
        if success and 'id' in response:
            self.created_student_ids.append(response['id'])
            return response['id']
        return None

    def test_get_student_by_id(self, student_id):
        """Get a student by ID"""
        success, response = self.run_test(
            "Get Student by ID",
            "GET",
            f"api/students/{student_id}",
            200
        )
        return success, response

    def test_update_student(self, student_id, update_data):
        """Update a student"""
        success, response = self.run_test(
            "Update Student",
            "PUT",
            f"api/students/{student_id}",
            200,
            data=update_data
        )
        return success, response

    def test_delete_student(self, student_id):
        """Delete a student"""
        success, response = self.run_test(
            "Delete Student",
            "DELETE",
            f"api/students/{student_id}",
            200
        )
        return success

    def test_get_stats(self):
        """Test statistics endpoint"""
        success, response = self.run_test(
            "Get Statistics",
            "GET",
            "api/students/stats/overview",
            200
        )
        return success, response

    def test_get_students_populated(self):
        """Test getting students when database has data"""
        success, response = self.run_test(
            "Get Students (Populated)",
            "GET",
            "api/students",
            200
        )
        return success, response

def main():
    print("🏫 Starting School Management System API Tests")
    print("=" * 60)
    
    # Setup
    tester = SchoolManagementAPITester()
    
    # Test data - using the correct backend schema
    test_students = [
        {
            "firstName": "Alice",
            "lastName": "Johnson",
            "gender": "Female",
            "dob": "2009-01-15",
            "studentClass": "Standard 8",
            "enrollmentDate": "2024-01-15",
            "parentName": "Robert Johnson",
            "relationship": "Father",
            "parentPhone": "+1-555-0101",
            "address": "123 Oak Street, Springfield, IL 62701"
        },
        {
            "firstName": "Bob",
            "lastName": "Smith",
            "gender": "Male",
            "dob": "2012-03-20",
            "studentClass": "Standard 5",
            "enrollmentDate": "2024-01-20",
            "parentName": "Sarah Smith",
            "relationship": "Mother",
            "parentPhone": "+1-555-0102",
            "address": "456 Pine Avenue, Springfield, IL 62702"
        },
        {
            "firstName": "Carol",
            "lastName": "Davis",
            "gender": "Female",
            "dob": "2016-07-10",
            "studentClass": "Standard 2",
            "enrollmentDate": "2024-01-25",
            "parentName": "Michael Davis",
            "relationship": "Father",
            "parentPhone": "+1-555-0103",
            "address": "789 Elm Drive, Springfield, IL 62703"
        }
    ]

    # Run tests
    print("\n📋 Phase 1: Basic API Tests")
    
    # Test health check
    if not tester.test_health_check():
        print("❌ Health check failed, stopping tests")
        return 1

    # Test initial state
    success, initial_students = tester.test_get_students_empty()
    if not success:
        print("❌ Failed to get initial students list")
        return 1

    print(f"\n📊 Initial state: {len(initial_students)} students in database")

    # Test statistics with initial state
    success, initial_stats = tester.test_get_stats()
    if not success:
        print("❌ Failed to get initial statistics")
        return 1

    print("\n📋 Phase 2: CRUD Operations")
    
    # Create students
    created_ids = []
    for student in test_students:
        student_id = tester.test_create_student(student)
        if student_id:
            created_ids.append(student_id)
        else:
            print(f"❌ Failed to create student: {student['name']}")

    if not created_ids:
        print("❌ No students were created successfully")
        return 1

    # Test getting students after creation
    success, populated_students = tester.test_get_students_populated()
    if success:
        print(f"📊 After creation: {len(populated_students)} students in database")

    # Test getting individual student
    if created_ids:
        success, student_data = tester.test_get_student_by_id(created_ids[0])
        if success:
            print(f"   Retrieved student: {student_data.get('firstName', 'N/A')} {student_data.get('lastName', '')}")

    # Test updating a student
    if created_ids:
        update_data = {
            "age": 16,
            "class_name": "Grade 11-A",
            "contact_phone": "+1-555-0199"
        }
        success, updated_student = tester.test_update_student(created_ids[0], update_data)
        if success:
            print(f"   Updated student age to: {updated_student.get('age', 'N/A')}")

    # Test statistics after adding students
    success, final_stats = tester.test_get_stats()
    if success:
        print(f"📊 Final statistics:")
        print(f"   Total students: {final_stats.get('total_students', 0)}")
        print(f"   Classes: {len(final_stats.get('class_distribution', []))}")
        print(f"   Age groups: {len(final_stats.get('age_distribution', []))}")

    print("\n📋 Phase 3: Cleanup Tests")
    
    # Test deleting a student
    if created_ids:
        success = tester.test_delete_student(created_ids[-1])
        if success:
            print("   Successfully deleted student")

    # Final verification
    success, final_students = tester.test_get_students_populated()
    if success:
        print(f"📊 After deletion: {len(final_students)} students in database")

    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Backend API is working correctly.")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())