import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

function Membership() {
  const [formData, setFormData] = useState({
    employeeId: '',
    username: '',
    surname: '',
    address: '',
    mobileNumber: '',
    telephoneNumber: '',
    province: '',
    district: '',
    municipality: '',
    wardNumber: '',
    tole: '',
    dob: null,
    postAtRetirement: '',
    pensionLeaseNumber: '',
    office: '',
    serviceStartDate: null,
    serviceRetirementDate: null,
    dateOfFillUp: null,
    place: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? format(date, 'yyyy-MM-dd') : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/user/register', formData);
      setSuccess(response.data.message);
      setShowSuccessPopup(true);
      setFormData({
        employeeId: '',
        username: '',
        surname: '',
        address: '',
        mobileNumber: '',
        telephoneNumber: '',
        province: '',
        district: '',
        municipality: '',
        wardNumber: '',
        tole: '',
        dob: null,
        postAtRetirement: '',
        pensionLeaseNumber: '',
        office: '',
        serviceStartDate: null,
        serviceRetirementDate: null,
        dateOfFillUp: null,
        place: '',
        email: '',
        password: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
  };

  const currentDate = new Date();
  const minDob = new Date(1900, 0, 1);
  const maxDob = new Date();
  const minServiceDate = new Date(1900, 0, 1);
  const maxServiceRetirementDate = new Date();
  const maxFillUpDate = new Date();

  return (
    <div className="bg-white text-gray-800 px-6 py-20 flex justify-center">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Membership Application
        </h1>
        <div className="text-center mb-6">
          <p>To,</p>
          <p className="font-semibold">The President,</p>
          <p>Nepal Telecommunications Employees Association.</p>
        </div>
        <p className="mb-6">
          Sir/Madam,
          <br />I am applying for lifetime/general membership of the Nepal
          Telecommunications Employees Association by submitting my personal
          details. I agree to abide by the statute, rules, and decisions of the
          association.
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && !showSuccessPopup && <div className="text-green-500 mb-4">{success}</div>}

        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Registration Successful!</h2>
              <p className="text-center text-gray-600 mb-6">Your membership application has been successfully submitted.</p>
              <div className="flex justify-center">
                <button
                  onClick={closePopup}
                  className="bg-[#0c1c35] text-white px-6 py-2 rounded-lg hover:bg-[#13284c] transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#0c1c35] text-white px-4 py-2 font-semibold rounded mb-6">
            Personal Information
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Surname *</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Mobile Number *</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Telephone Number *</label>
              <input
                type="tel"
                name="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>

          <div>
            <label>Date of Birth *</label>
            <DatePicker
              selected={formData.dob ? new Date(formData.dob) : null}
              onChange={(date) => handleDateChange(date, 'dob')}
              dateFormat="yyyy-MM-dd"
              className="mt-1 p-2 border rounded w-full"
              placeholderText="Select Date"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              minDate={minDob}
              maxDate={maxDob}
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              required
            />
          </div>

          <div className="bg-[#0c1c35] text-white px-4 py-2 font-semibold rounded mt-10 mb-6">
            Address Information
          </div>
          <div>
            <label>Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Province *</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              >
                <option value="">Select Province</option>
                <option value="province 1">Province 1</option>
                <option value="province 2">Province 2</option>
                <option value="bagmati">Bagmati</option>
                <option value="gandaki">Gandaki</option>
                <option value="lumbini">Lumbini</option>
                <option value="karnali">Karnali</option>
                <option value="sudurpashchim">Sudurpashchim</option>
              </select>
            </div>
            <div>
              <label>District *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Municipality/Metropolitan *</label>
              <input
                type="text"
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Ward Number *</label>
              <input
                type="text"
                name="wardNumber"
                value={formData.wardNumber}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>
          <div>
            <label>Tole *</label>
            <input
              type="text"
              name="tole"
              value={formData.tole}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="bg-[#0c1c35] text-white px-4 py-2 font-semibold rounded mt-10 mb-6">
            Organization Information
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Office *</label>
              <input
                type="text"
                name="office"
                value={formData.office}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Post at Retirement *</label>
              <input
                type="text"
                name="postAtRetirement"
                value={formData.postAtRetirement}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Pension Lease Number *</label>
              <input
                type="text"
                name="pensionLeaseNumber"
                value={formData.pensionLeaseNumber}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Service Start Date *</label>
              <DatePicker
                selected={formData.serviceStartDate ? new Date(formData.serviceStartDate) : null}
                onChange={(date) => handleDateChange(date, 'serviceStartDate')}
                dateFormat="yyyy-MM-dd"
                className="mt-1 p-2 border rounded w-full"
                placeholderText="Select Date"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                minDate={minServiceDate}
                maxDate={maxServiceRetirementDate}
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                required
              />
            </div>
            <div>
              <label>Service Retirement Date *</label>
              <DatePicker
                selected={formData.serviceRetirementDate ? new Date(formData.serviceRetirementDate) : null}
                onChange={(date) => handleDateChange(date, 'serviceRetirementDate')}
                dateFormat="yyyy-MM-dd"
                className="mt-1 p-2 border rounded w-full"
                placeholderText="Select Date"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                minDate={formData.serviceStartDate ? new Date(formData.serviceStartDate) : minServiceDate}
                maxDate={maxServiceRetirementDate}
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                required
              />
            </div>
          </div>

          <div className="bg-[#0c1c35] text-white px-4 py-2 font-semibold rounded mt-10 mb-6">
            Membership Information
          </div>
          <div>
            <label>Date of Fill Up *</label>
            <DatePicker
              selected={formData.dateOfFillUp ? new Date(formData.dateOfFillUp) : null}
              onChange={(date) => handleDateChange(date, 'dateOfFillUp')}
              dateFormat="yyyy-MM-dd"
              className="mt-1 p-2 border rounded w-full"
              placeholderText="Select Date"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              maxDate={maxFillUpDate}
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              required
            />
          </div>
          <div>
            <label>Place *</label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="reset"
              className="bg-white border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
              onClick={() => setFormData({
                employeeId: '',
                username: '',
                surname: '',
                address: '',
                mobileNumber: '',
                telephoneNumber: '',
                province: '',
                district: '',
                municipality: '',
                wardNumber: '',
                tole: '',
                dob: null,
                postAtRetirement: '',
                pensionLeaseNumber: '',
                office: '',
                serviceStartDate: null,
                serviceRetirementDate: null,
                dateOfFillUp: null,
                place: '',
                email: '',
                password: '',
              })}
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-[#0c1c35] text-white px-6 py-2 rounded hover:bg-[#13284c]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Membership;