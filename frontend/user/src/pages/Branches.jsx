const branches = Array.from({ length: 12 }).map((_, i) => ({
  name: "TELECOM WORLD",
  address: "NEW ROAD",
  link: "mmmmmmmmmm", // Replace with real direction links if needed
}));

function Branches() {
  return (
    <div className="bg-gray-50 px-6 py-16">
      <h1 className="text-2xl font-bold text-center mb-10">Our Branches</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {branches.map((branch, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-lg p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-lg">{branch.name}</h3>
              <p className="text-sm text-gray-600">{branch.address}</p>
              <a href="#" className="text-blue-600 text-sm hover:underline">
                {branch.link}
              </a>
            </div>

            <button className="mt-4 bg-[#0c1c35] text-white py-2 px-4 rounded hover:bg-[#13284c]">
              Get Direction
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Branches;
