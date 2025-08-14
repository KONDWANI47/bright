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
    name: str
    age: int
    class_name: str
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    parent_name: Optional[str] = None
    address: Optional[str] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    class_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    parent_name: Optional[str] = None
    address: Optional[str] = None

class StudentResponse(BaseModel):
    id: str
    name: str
    age: int
    class_name: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    parent_name: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# Utility functions
def student_helper(student) -> dict:
    return {
        "id": student["id"],
        "name": student["name"],
        "age": student["age"],
        "class_name": student["class_name"],
        "contact_email": student.get("contact_email"),
        "contact_phone": student.get("contact_phone"),
        "parent_name": student.get("parent_name"),
        "address": student.get("address"),
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