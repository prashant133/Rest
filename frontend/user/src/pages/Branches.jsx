import React from "react";

const branches = [
  {
    name: "Central",
    address: "Kathmandu, Bagmati Province",
    link: "https://www.google.com/maps?q=Kathmandu",
  },
  {
    name: "Province 1",
    address: "Biratnagar, Province 1",
    link: "https://www.google.com/maps?q=Biratnagar",
  },
  {
    name: "Madhesh",
    address: "Janakpur, Madhesh Province",
    link: "https://www.google.com/maps?q=Janakpur",
  },
  {
    name: "Gandaki",
    address: "Pokhara, Gandaki Province",
    link: "https://www.google.com/maps?q=Pokhara",
  },
  {
    name: "Lumbini",
    address: "Butwal, Lumbini Province",
    link: "https://www.google.com/maps?q=Butwal",
  },
  {
    name: "Karnali",
    address: "Birendranagar, Karnali Province",
    link: "https://www.google.com/maps?q=Birendranagar",
  },
  {
    name: "Sudurpashchim",
    address: "Dhangadhi, Sudurpashchim Province",
    link: "https://www.google.com/maps?q=Dhangadhi",
  },
];

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
              <a
                href={branch.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                View on Map
              </a>
            </div>

            <a
              href={branch.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-[#0c1c35] text-white py-2 px-4 rounded hover:bg-[#13284c] text-center"
            >
              Get Direction
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Branches;
