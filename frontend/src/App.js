import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';
import { Textarea } from './components/ui/textarea';
import { UserPlus, Users, GraduationCap, Phone, Mail, MapPin, Edit3, Trash2, Search } from 'lucide-react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total_students: 0, class_distribution: [], age_distribution: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class_name: '',
    contact_email: '',
    contact_phone: '',
    parent_name: '',
    address: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/students`);
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students/stats/overview`);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        age: parseInt(formData.age)
      };

      let response;
      if (editingStudent) {
        response = await axios.put(`${API_BASE_URL}/api/students/${editingStudent.id}`, dataToSubmit);
        setSuccess('Student updated successfully!');
      } else {
        response = await axios.post(`${API_BASE_URL}/api/students`, dataToSubmit);
        setSuccess('Student added successfully!');
      }

      setFormData({
        name: '',
        age: '',
        class_name: '',
        contact_email: '',
        contact_phone: '',
        parent_name: '',
        address: ''
      });
      setEditingStudent(null);
      setIsDialogOpen(false);
      fetchStudents();
      fetchStats();
      setError('');
    } catch (err) {
      setError(editingStudent ? 'Failed to update student' : 'Failed to add student');
      console.error('Error submitting form:', err);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      age: student.age.toString(),
      class_name: student.class_name,
      contact_email: student.contact_email || '',
      contact_phone: student.contact_phone || '',
      parent_name: student.parent_name || '',
      address: student.address || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/students/${studentId}`);
        setSuccess('Student deleted successfully!');
        fetchStudents();
        fetchStats();
        setError('');
      } catch (err) {
        setError('Failed to delete student');
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleNewStudent = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      age: '',
      class_name: '',
      contact_email: '',
      contact_phone: '',
      parent_name: '',
      address: ''
    });
    setIsDialogOpen(true);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.parent_name && student.parent_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  EduManage
                </h1>
                <p className="text-gray-600 text-sm">School Management System</p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewStudent} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-800">
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {editingStudent ? 'Update student information' : 'Enter student details to add them to the system'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="mt-1"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        required
                        min="5"
                        max="25"
                        className="mt-1"
                        placeholder="Age"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="class_name" className="text-sm font-medium text-gray-700">Class *</Label>
                    <Input
                      id="class_name"
                      value={formData.class_name}
                      onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                      required
                      className="mt-1"
                      placeholder="e.g., Grade 10-A, Class 5-B"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                        className="mt-1"
                        placeholder="student@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone" className="text-sm font-medium text-gray-700">Phone</Label>
                      <Input
                        id="contact_phone"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                        className="mt-1"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="parent_name" className="text-sm font-medium text-gray-700">Parent/Guardian Name</Label>
                    <Input
                      id="parent_name"
                      value={formData.parent_name}
                      onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                      className="mt-1"
                      placeholder="Parent or guardian name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="mt-1"
                      placeholder="Full address"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      {editingStudent ? 'Update Student' : 'Add Student'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <GraduationCap className="h-4 w-4 mr-2" />
              Students
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.total_students}</div>
                  <p className="text-xs text-gray-500 mt-1">Enrolled students</p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Classes</CardTitle>
                  <GraduationCap className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stats.class_distribution.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Different classes</p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Age Range</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.age_distribution.length > 0 
                      ? `${Math.min(...stats.age_distribution.map(a => a._id))}-${Math.max(...stats.age_distribution.map(a => a._id))}`
                      : '0-0'
                    }
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Years old</p>
                </CardContent>
              </Card>
            </div>

            {/* Class Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Class Distribution</CardTitle>
                  <CardDescription>Number of students per class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.class_distribution.slice(0, 8).map((classItem, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{classItem._id}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {classItem.count} students
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Age Distribution</CardTitle>
                  <CardDescription>Students by age groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.age_distribution.slice(0, 8).map((ageItem, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{ageItem._id} years old</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {ageItem.count} students
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            {/* Search Bar */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students by name, class, or parent name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Students List ({filteredStudents.length})
                </CardTitle>
                <CardDescription>Manage student information and enrollment</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading students...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No students found matching your search.' : 'No students enrolled yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Parent/Guardian</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.age}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {student.class_name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {student.contact_email && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {student.contact_email}
                                  </div>
                                )}
                                {student.contact_phone && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {student.contact_phone}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{student.parent_name || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(student)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(student.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;