function Membership() {
  return (
    <div className="bg-white text-gray-800 px-6 py-20 flex justify-center">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded p-8">
        {/* Header */}
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

        {/* --- Personal Information --- */}
        <div className="bg-[#0c1c35] text-white px-4 py-2 font-semibold rounded mb-6">
          Personal Information
        </div>
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>First Name *</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Last Name *</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Spouse's First Name</label>
              <input type="text" className="mt-1 p-2 border rounded w-full" />
            </div>
            <div>
              <label>Spouse's Last Name</label>
              <input type="text" className="mt-1 p-2 border rounded w-full" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Email *</label>
              <input
                type="email"
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Phone *</label>
              <input
                type="tel"
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>

          <div>
            <label>Address *</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>City</label>
              <input type="text" className="mt-1 p-2 border rounded w-full" />
            </div>
            <div>
              <label>State</label>
              <select className="mt-1 p-2 border rounded w-full">
                <option>Select State</option>
                <option>Province 1</option>
                <option>Province 2</option>
                <option>Bagmati</option>
                <option>Gandaki</option>
                <option>Lumbini</option>
                <option>Karnali</option>
                <option>Sudurpashchim</option>
              </select>
            </div>
          </div>

          {/* --- Organization Information --- */}
          <div className="bg-[#0c1c35] text-white px-4 py-2 font-semibold rounded mt-10 mb-6">
            Organization Information
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Organization *</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Address</label>
              <input type="text" className="mt-1 p-2 border rounded w-full" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Pension *</label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label>Work Email *</label>
              <input
                type="email"
                className="mt-1 p-2 border rounded w-full"
                required
              />
            </div>
          </div>

          {/* --- Permanent Address --- */}
          <div className="bg-[#0c1c35] text-white px-4 py-2 font-semibold rounded mt-10 mb-6">
            Permanent Address
          </div>

          <div>
            <label>Province Name *</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div>
            <label>District *</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div>
            <label>Municipality/Metropolitan *</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Ward No</label>
              <input type="text" className="mt-1 p-2 border rounded w-full" />
            </div>
            <div>
              <label>State</label>
              <select className="mt-1 p-2 border rounded w-full">
                <option>Select State</option>
                <option>Province 1</option>
                <option>Province 2</option>
                <option>Bagmati</option>
                <option>Gandaki</option>
                <option>Lumbini</option>
                <option>Karnali</option>
                <option>Sudurpashchim</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="reset"
              className="bg-white border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
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
