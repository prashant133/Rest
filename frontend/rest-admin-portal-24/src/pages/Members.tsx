import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import axios, { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api/v1';

interface Member {
  _id: string;
  employeeId: string;
  username: string;
  surname: string;
  address: string;
  province: string;
  district: string;
  municipality: string;
  wardNumber: string;
  tole: string;
  telephoneNumber: string;
  mobileNumber: string;
  dob: string;
  postAtRetirement: string;
  pensionLeaseNumber: string;
  office: string;
  serviceStartDate: string;
  serviceRetirementDate: string;
  dateOfFillUp: string;
  place: string;
  email: string;
  membershipNumber: string;
  registrationNumber: string;
  role: string;
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    username: '',
    surname: '',
    address: '',
    province: '',
    district: '',
    municipality: '',
    wardNumber: '',
    tole: '',
    telephoneNumber: '',
    mobileNumber: '',
    dob: '',
    postAtRetirement: '',
    pensionLeaseNumber: '',
    office: '',
    serviceStartDate: '',
    serviceRetirementDate: '',
    dateOfFillUp: '',
    place: '',
    email: '',
  });

  // Validation function for form data
  const validateForm = () => {
    const requiredFields = [
      'employeeId', 'username', 'surname', 'address', 'province', 'district',
      'municipality', 'wardNumber', 'tole', 'telephoneNumber', 'mobileNumber',
      'dob', 'postAtRetirement', 'pensionLeaseNumber', 'office',
      'serviceStartDate', 'serviceRetirementDate', 'dateOfFillUp', 'place', 'email'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        return `Field '${field}' is required`;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Invalid email format';
    }
    
    // Phone number validation
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(formData.mobileNumber) || !phoneRegex.test(formData.telephoneNumber)) {
      return 'Phone numbers must be 7-15 digits';
    }
    
    return '';
  };

  // Fetch all members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE_URL}/user/get-all-users`, {
        withCredentials: true,
        headers: { 'x-admin-frontend': 'true' }
      });

      // Normalize members
      const normalizedMembers: Member[] = response.data.data
        .filter((user: Member) => user.role === 'user')
        .map((user: Member) => ({
          _id: user._id,
          employeeId: user.employeeId,
          username: user.username,
          surname: user.surname,
          address: user.address,
          province: user.province,
          district: user.district,
          municipality: user.municipality,
          wardNumber: user.wardNumber,
          tole: user.tole,
          telephoneNumber: user.telephoneNumber,
          mobileNumber: user.mobileNumber,
          dob: user.dob.split('T')[0], // Normalize date format
          postAtRetirement: user.postAtRetirement,
          pensionLeaseNumber: user.pensionLeaseNumber,
          office: user.office,
          serviceStartDate: user.serviceStartDate.split('T')[0],
          serviceRetirementDate: user.serviceRetirementDate.split('T')[0],
          dateOfFillUp: user.dateOfFillUp.split('T')[0],
          place: user.place,
          email: user.email,
          membershipNumber: user.membershipNumber,
          registrationNumber: user.registrationNumber,
          role: user.role
        }));

      setMembers(normalizedMembers);
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch members'
        : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMembers();
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = async (member: Member) => {
    try {
      setError('');
      const response = await axios.get(`${API_BASE_URL}/user/get-user/${member._id}`, {
        withCredentials: true,
        headers: { 'x-admin-frontend': 'true' }
      });
      
      const userData = response.data.data;
      setCurrentMember(userData);
      setFormData({
        employeeId: userData.employeeId,
        username: userData.username,
        surname: userData.surname,
        address: userData.address,
        province: userData.province,
        district: userData.district,
        municipality: userData.municipality,
        wardNumber: userData.wardNumber,
        tole: userData.tole,
        telephoneNumber: userData.telephoneNumber,
        mobileNumber: userData.mobileNumber,
        dob: userData.dob.split('T')[0],
        postAtRetirement: userData.postAtRetirement,
        pensionLeaseNumber: userData.pensionLeaseNumber,
        office: userData.office,
        serviceStartDate: userData.serviceStartDate.split('T')[0],
        serviceRetirementDate: userData.serviceRetirementDate.split('T')[0],
        dateOfFillUp: userData.dateOfFillUp.split('T')[0],
        place: userData.place,
        email: userData.email,
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch member details'
        : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    try {
      setError('');
      if (isEditMode && currentMember) {
        // Update existing member
        await axios.patch(
          `${API_BASE_URL}/user/update-user/${currentMember._id}`,
          formData,
          {
            withCredentials: true,
            headers: { 'x-admin-frontend': 'true' }
          }
        );
        toast({
          title: 'Success',
          description: 'Member updated successfully',
        });
      } else {
        // Create new member (requires password for registration)
        await axios.post(
          `${API_BASE_URL}/user/register`,
          { ...formData, password: 'defaultPassword123' }, // Note: In production, handle password securely
          {
            withCredentials: true,
            headers: { 'x-admin-frontend': 'true' }
          }
        );
        toast({
          title: 'Success',
          description: 'Member created successfully',
        });
      }
      fetchMembers();
      resetFormAndCloseModal();
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to save member'
        : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }

    try {
      setError('');
      await axios.delete(
        `${API_BASE_URL}/user/delete-user/${id}`,
        {
          withCredentials: true,
          headers: { 'x-admin-frontend': 'true' }
        }
      );
      toast({
        title: 'Success',
        description: 'Member deleted successfully',
      });
      fetchMembers();
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to delete member'
        : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const resetFormAndCloseModal = () => {
    setFormData({
      employeeId: '',
      username: '',
      surname: '',
      address: '',
      province: '',
      district: '',
      municipality: '',
      wardNumber: '',
      tole: '',
      telephoneNumber: '',
      mobileNumber: '',
      dob: '',
      postAtRetirement: '',
      pensionLeaseNumber: '',
      office: '',
      serviceStartDate: '',
      serviceRetirementDate: '',
      dateOfFillUp: '',
      place: '',
      email: '',
    });
    setCurrentMember(null);
    setIsEditMode(false);
    setIsModalOpen(false);
    setError('');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Members</h1>
        <Button 
          onClick={() => {
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
          className="bg-gray-800 hover:bg-gray-700"
        >
          + Add Member
        </Button>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Membership No.</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No members found.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>{member.employeeId}</TableCell>
                    <TableCell className="font-medium">{member.username} {member.surname}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.mobileNumber}</TableCell>
                    <TableCell>{member.membershipNumber}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => handleEdit(member)}
                        className="text-gray-600 hover:text-gray-900 mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(member._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Add/Edit Member Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditMode ? 'Edit Member' : 'Add Member'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Update member details' : 'Fill in the member details'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="col-span-2">
                <h3 className="font-medium mb-2">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="employeeId" className="text-sm font-medium">Employee ID:</label>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="username" className="text-sm font-medium">First Name:</label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="surname" className="text-sm font-medium">Surname:</label>
                    <Input
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="dob" className="text-sm font-medium">Date of Birth:</label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">Email:</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="col-span-2">
                <h3 className="font-medium mb-2">Contact Information</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="address" className="text-sm font-medium">Address:</label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="province" className="text-sm font-medium">Province:</label>
                    <Input
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="district" className="text-sm font-medium">District:</label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="municipality" className="text-sm font-medium">Municipality:</label>
                    <Input
                      id="municipality"
                      name="municipality"
                      value={formData.municipality}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="wardNumber" className="text-sm font-medium">Ward Number:</label>
                    <Input
                      id="wardNumber"
                      name="wardNumber"
                      value={formData.wardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="tole" className="text-sm font-medium">Tole:</label>
                    <Input
                      id="tole"
                      name="tole"
                      value={formData.tole}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="telephoneNumber" className="text-sm font-medium">Telephone:</label>
                    <Input
                      id="telephoneNumber"
                      name="telephoneNumber"
                      value={formData.telephoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="mobileNumber" className="text-sm font-medium">Mobile:</label>
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Employment Information */}
              <div className="col-span-2">
                <h3 className="font-medium mb-2">Employment Information</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="postAtRetirement" className="text-sm font-medium">Post at Retirement:</label>
                    <Input
                      id="postAtRetirement"
                      name="postAtRetirement"
                      value={formData.postAtRetirement}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="pensionLeaseNumber" className="text-sm font-medium">Pension Lease Number:</label>
                    <Input
                      id="pensionLeaseNumber"
                      name="pensionLeaseNumber"
                      value={formData.pensionLeaseNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="office" className="text-sm font-medium">Office:</label>
                    <Input
                      id="office"
                      name="office"
                      value={formData.office}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="serviceStartDate" className="text-sm font-medium">Service Start Date:</label>
                    <Input
                      id="serviceStartDate"
                      name="serviceStartDate"
                      type="date"
                      value={formData.serviceStartDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="serviceRetirementDate" className="text-sm font-medium">Service Retirement Date:</label>
                    <Input
                      id="serviceRetirementDate"
                      name="serviceRetirementDate"
                      type="date"
                      value={formData.serviceRetirementDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="dateOfFillUp" className="text-sm font-medium">Date of Fill Up:</label>
                    <Input
                      id="dateOfFillUp"
                      name="dateOfFillUp"
                      type="date"
                      value={formData.dateOfFillUp}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="place" className="text-sm font-medium">Place:</label>
                    <Input
                      id="place"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetFormAndCloseModal}
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                {isEditMode && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (currentMember) {
                        handleDelete(currentMember._id);
                        resetFormAndCloseModal();
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
                
                <Button type="submit" className="bg-gray-700 text-white px-6">
                  {isEditMode ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Members;