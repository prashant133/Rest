
import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Member {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  retirementDate: string;
  photo?: string;
}

const initialMembers: Member[] = [
  {
    id: 1,
    name: 'Rakesh Thapa',
    address: 'Kalanki, Ktm',
    phone: '9842222222',
    email: 'rakeshtahapa@gmail.com',
    retirementDate: '2058-1-25',
  },
  {
    id: 2,
    name: 'Yogesh Roka',
    address: 'Bafak, Ktm',
    phone: '9844444444',
    email: 'yoeshroka@gmail.com',
    retirementDate: '2074-2-30',
  },
  {
    id: 3,
    name: 'Hari Karki',
    address: 'Butwal',
    phone: '9843333333',
    email: 'harikarki@gmail.com',
    retirementDate: '2081-12-14',
  },
  {
    id: 4,
    name: 'Nisha Gc',
    address: 'Hetauda',
    phone: '9843000000',
    email: 'nishagc@gmail.com',
    retirementDate: '2080-9-5',
  },
  {
    id: 5,
    name: 'Sita Magar',
    address: 'Chitwan',
    phone: '9800000000',
    email: 'sitamagar@gmail.com',
    retirementDate: '2073-11-25',
  },
];

const Members = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    retirementDate: '',
    photo: null as File | null,
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    setFormErrors({
      ...formErrors,
      [name]: '',
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        photo: file,
      });
      
      // Preview the photo
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      phone: '',
    };
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone number should be 10 digits';
    }
    
    setFormErrors(errors);
    
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (isEditMode && currentMember) {
        // Update existing member
        const updatedMembers = members.map(member => {
          if (member.id === currentMember.id) {
            return {
              ...member,
              name: formData.name,
              address: formData.address,
              phone: formData.phone,
              email: formData.email,
              retirementDate: formData.retirementDate,
              photo: photoPreview || member.photo,
            };
          }
          return member;
        });
        
        setMembers(updatedMembers);
        toast({
          title: "Member Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Add new member
        const newMember: Member = {
          id: members.length + 1,
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          retirementDate: formData.retirementDate,
          photo: photoPreview || undefined,
        };
        
        setMembers([...members, newMember]);
        toast({
          title: "Success",
          description: `${newMember.name} has been added to the members list.`,
        });
      }
      
      // Reset form and close modal
      resetFormAndCloseModal();
    }
  };

  const handleEdit = (member: Member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      address: member.address,
      phone: member.phone,
      email: member.email,
      retirementDate: member.retirementDate,
      photo: null,
    });
    setPhotoPreview(member.photo || null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const updatedMembers = members.filter(member => member.id !== id);
    setMembers(updatedMembers);
    
    toast({
      title: "Member Deleted",
      description: "The member has been deleted successfully.",
      variant: "destructive",
    });
  };

  const resetFormAndCloseModal = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      retirementDate: '',
      photo: null,
    });
    setFormErrors({
      name: '',
      email: '',
      phone: '',
    });
    setPhotoPreview(null);
    setCurrentMember(null);
    setIsEditMode(false);
    setIsModalOpen(false);
  };

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
          + Add Members
        </Button>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone no</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Retirement Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.address}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.retirementDate}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleEdit(member)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Add/Edit Member Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditMode ? 'Edit Member' : 'Add Members'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name:</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
                {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="address" className="text-sm font-medium">Address:</label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone no:</label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
                {formErrors.phone && <p className="text-red-500 text-xs">{formErrors.phone}</p>}
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email:</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-10"
                  required
                />
                {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="retirementDate" className="text-sm font-medium">Retirement Date:</label>
                <Input
                  id="retirementDate"
                  name="retirementDate"
                  type="date"
                  value={formData.retirementDate}
                  onChange={handleInputChange}
                  className="h-10"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="photo" className="text-sm font-medium">Photo Upload:</label>
                <Input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="h-auto p-2"
                />
                {photoPreview && (
                  <div className="mt-2">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
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
                        handleDelete(currentMember.id);
                        resetFormAndCloseModal();
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
                
                <Button type="submit" className="bg-gray-700 text-white px-6">
                  {isEditMode ? 'Update' : 'Upload File'}
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
