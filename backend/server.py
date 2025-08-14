from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime, timedelta
from enum import Enum
import bcrypt
from jose import JWTError, jwt
import asyncio

# Environment variables
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")
SECRET_KEY = "bright_academy_secret_key_2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(title="Bright Academy Management System", description="Complete school management system with MongoDB backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
students_collection = db.students
teachers_collection = db.teachers
grades_collection = db.grades
users_collection = db.users
notifications_collection = db.notifications

# Enums
class Gender(str, Enum):
    male = "Male"
    female = "Female"

class StudentClass(str, Enum):
    play_group = "Play Group"
    pp1 = "PP1"
    pp2 = "PP2"
    ecd = "ECD"
    standard_1 = "Standard 1"
    standard_2 = "Standard 2"
    standard_3 = "Standard 3"
    standard_4 = "Standard 4"
    standard_5 = "Standard 5"
    standard_6 = "Standard 6"
    standard_7 = "Standard 7"
    standard_8 = "Standard 8"

class TermEnum(str, Enum):
    term_1 = "Term 1"
    term_2 = "Term 2"
    term_3 = "Term 3"

# Pydantic models
class StudentCreate(BaseModel):
    firstName: str
    lastName: str
    gender: Gender
    dob: str
    studentClass: StudentClass
    enrollmentDate: str
    parentName: str
    relationship: str
    parentPhone: str
    address: str
    photo: Optional[str] = "https://via.placeholder.com/50"

class StudentUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    gender: Optional[Gender] = None
    dob: Optional[str] = None
    studentClass: Optional[StudentClass] = None
    enrollmentDate: Optional[str] = None
    parentName: Optional[str] = None
    relationship: Optional[str] = None
    parentPhone: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None

class StudentResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    gender: str
    dob: str
    studentClass: str
    enrollmentDate: str
    parentName: str
    relationship: str
    parentPhone: str
    address: str
    photo: str
    created_at: datetime
    updated_at: datetime

class TeacherCreate(BaseModel):
    firstName: str
    lastName: str
    gender: Gender
    dob: str
    email: EmailStr
    phone: str
    qualification: str
    hireDate: str
    subjects: str
    classes: str
    address: str
    photo: Optional[str] = "https://via.placeholder.com/50"

class TeacherUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    gender: Optional[Gender] = None
    dob: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    qualification: Optional[str] = None
    hireDate: Optional[str] = None
    subjects: Optional[str] = None
    classes: Optional[str] = None
    address: Optional[str] = None
    photo: Optional[str] = None

class TeacherResponse(BaseModel):
    id: str
    firstName: str
    lastName: str
    gender: str
    dob: str
    email: str
    phone: str
    qualification: str
    hireDate: str
    subjects: str
    classes: str
    address: str
    photo: str
    created_at: datetime
    updated_at: datetime

class GradeCreate(BaseModel):
    studentId: str
    term: TermEnum
    english: int
    chichewa: int
    math: int
    science: int
    socialStudies: int
    comments: Optional[str] = ""

class GradeUpdate(BaseModel):
    term: Optional[TermEnum] = None
    english: Optional[int] = None
    chichewa: Optional[int] = None
    math: Optional[int] = None
    science: Optional[int] = None
    socialStudies: Optional[int] = None
    comments: Optional[str] = None

class GradeResponse(BaseModel):
    id: str
    studentId: str
    studentName: str
    studentClass: str
    term: str
    english: int
    chichewa: int
    math: int
    science: int
    socialStudies: int
    average: float
    grade: str
    comments: str
    created_at: datetime
    updated_at: datetime

class LoginRequest(BaseModel):
    username: str
    password: str

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "info"  # info, success, warning, error
    target_audience: str = "all"  # all, students, teachers

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    type: str
    target_audience: str
    created_at: datetime
    read: bool = False

# Utility functions
def student_helper(student) -> dict:
    # Handle both old and new data formats
    if "firstName" in student and "lastName" in student:
        # New format - data is already in the correct format
        return {
            "id": student["id"],
            "firstName": student.get("firstName", ""),
            "lastName": student.get("lastName", ""),
            "gender": student.get("gender", "Male"),
            "dob": student.get("dob", "2000-01-01"),
            "studentClass": student.get("studentClass", ""),
            "enrollmentDate": student.get("enrollmentDate", student["created_at"].strftime("%Y-%m-%d")),
            "parentName": student.get("parentName", ""),
            "relationship": student.get("relationship", "Parent"),
            "parentPhone": student.get("parentPhone", ""),
            "address": student.get("address", ""),
            "photo": student.get("photo", "https://via.placeholder.com/50"),
            "created_at": student["created_at"],
            "updated_at": student["updated_at"]
        }
    else:
        # Old format - convert from old schema to new schema
        name_parts = student.get("name", "").split(" ", 1)
        first_name = name_parts[0] if name_parts else ""
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        return {
            "id": student["id"],
            "firstName": first_name,
            "lastName": last_name,
            "gender": student.get("gender", "Male"),
            "dob": student.get("dob", "2000-01-01"),
            "studentClass": student.get("class_name", ""),
            "enrollmentDate": student.get("enrollmentDate", student["created_at"].strftime("%Y-%m-%d")),
            "parentName": student.get("parent_name", ""),
            "relationship": student.get("relationship", "Parent"),
            "parentPhone": student.get("contact_phone", ""),
            "address": student.get("address", ""),
            "photo": student.get("photo", "https://via.placeholder.com/50"),
            "created_at": student["created_at"],
            "updated_at": student["updated_at"]
        }

# Root endpoint
@app.get("/")
async def root():
    return {"message": "School Management System API", "status": "running"}

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "school-management-api"}

# Get all students
@app.get("/api/students", response_model=List[StudentResponse])
async def get_students(skip: int = 0, limit: int = 100):
    try:
        students = await students_collection.find().skip(skip).limit(limit).to_list(limit)
        return [student_helper(student) for student in students]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching students: {str(e)}")

# Get student by ID
@app.get("/api/students/{student_id}", response_model=StudentResponse)
async def get_student(student_id: str):
    try:
        student = await students_collection.find_one({"id": student_id})
        if student:
            return student_helper(student)
        raise HTTPException(status_code=404, detail="Student not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching student: {str(e)}")

# Create new student
@app.post("/api/students", response_model=StudentResponse)
async def create_student(student: StudentCreate):
    try:
        student_dict = student.dict()
        student_dict["id"] = str(uuid.uuid4())
        student_dict["created_at"] = datetime.utcnow()
        student_dict["updated_at"] = datetime.utcnow()
        
        result = await students_collection.insert_one(student_dict)
        if result.inserted_id:
            new_student = await students_collection.find_one({"id": student_dict["id"]})
            return student_helper(new_student)
        raise HTTPException(status_code=500, detail="Failed to create student")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating student: {str(e)}")

# Update student
@app.put("/api/students/{student_id}", response_model=StudentResponse)
async def update_student(student_id: str, student_update: StudentUpdate):
    try:
        # Check if student exists
        existing_student = await students_collection.find_one({"id": student_id})
        if not existing_student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Prepare update data
        update_data = {k: v for k, v in student_update.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        update_data["updated_at"] = datetime.utcnow()
        
        # Update student
        result = await students_collection.update_one(
            {"id": student_id},
            {"$set": update_data}
        )
        
        if result.modified_count:
            updated_student = await students_collection.find_one({"id": student_id})
            return student_helper(updated_student)
        
        raise HTTPException(status_code=500, detail="Failed to update student")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating student: {str(e)}")

# Delete student
@app.delete("/api/students/{student_id}")
async def delete_student(student_id: str):
    try:
        result = await students_collection.delete_one({"id": student_id})
        if result.deleted_count:
            return {"message": "Student deleted successfully", "student_id": student_id}
        raise HTTPException(status_code=404, detail="Student not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting student: {str(e)}")

# Get student statistics
@app.get("/api/students/stats/overview")
async def get_student_stats():
    try:
        total_students = await students_collection.count_documents({})
        
        # Get class distribution
        pipeline = [
            {"$group": {"_id": "$class_name", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        class_distribution = await students_collection.aggregate(pipeline).to_list(None)
        
        # Get age distribution
        age_pipeline = [
            {"$group": {"_id": "$age", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}}
        ]
        age_distribution = await students_collection.aggregate(age_pipeline).to_list(None)
        
        return {
            "total_students": total_students,
            "class_distribution": class_distribution,
            "age_distribution": age_distribution
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching statistics: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)