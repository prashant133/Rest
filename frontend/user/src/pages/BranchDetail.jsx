import React from "react";
import { useParams, Link } from "react-router-dom";
import slugify from "slugify";
import rest from "../assets/rest.jpg";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const branches = [
  {
    name: "Central",
    address: "Kathmandu, Bagmati Province",
    mapLink: "https://www.google.com/maps?q=Kathmandu",
    description:
      "The Central branch, located in the heart of Kathmandu, serves as the headquarters of the Nepal Telecommunication Retired Employees Society (REST). It coordinates nationwide initiatives and supports retired telecom professionals in Bagmati Province.",
    contact: { phone: "+977-1-1234567", email: "central@rest.org.np" },
  },
  {
    name: "Province 1",
    address: "Biratnagar, Province 1",
    mapLink: "https://www.google.com/maps?q=Biratnagar",
    description:
      "The Province 1 branch in Biratnagar focuses on empowering retired telecom employees through skill development programs and community engagement in eastern Nepal.",
    contact: { phone: "+977-21-1234567", email: "province1@rest.org.np" },
  },
  // ... other branches
];

function BranchDetail() {
  const { branchName } = useParams();
  const branch = branches.find(
    (b) => slugify(b.name, { lower: true, strict: true }) === branchName
  );

  if (!branch) {
    return (
      <div className="px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Branch Not Found</h1>
        <p className="mt-4">The requested branch does not exist.</p>
        <Link
          to="/branch"
          className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Back to Branches
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="py-20"
        style={{
          backgroundImage: `url(${rest})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "overlay",
          position: "relative",
          minHeight: "80vh",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
        <div className="relative z-10">
          <div className="container mx-auto px-6 text-center text-white">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
              style={{
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 0, 0, 0.5)",
                opacity: 0.95,
              }}
            >
              {branch.name} Branch
            </h1>
            <p
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{
                textShadow: "1px 1px 6px rgba(0, 0, 0, 0.7)",
                opacity: 0.90,
              }}
            >
              {branch.address}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-3xl font-bold mb-6">
              Welcome to the {branch.name} Branch
            </h1>
            <p className="mb-4">{branch.description}</p>
            <p className="mb-4">
              The {branch.name} branch is dedicated to supporting retired
              telecommunications professionals by providing opportunities for skill
              enhancement, community engagement, and advocacy for their rights and
              welfare.
            </p>
            <p>
              As part of the Nepal Telecommunication Retired Employees Society
              (REST), we strive to ensure that retirees remain active contributors
              to society and the telecommunications sector.
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                icon: <FaMapMarkerAlt size={24} />,
                title: "Location",
                desc: branch.address,
              },
              {
                icon: <FaPhone size={24} />,
                title: "Contact",
                desc: branch.contact.phone,
              },
              {
                icon: <FaEnvelope size={24} />,
                title: "Email",
                desc: branch.contact.email,
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="border border-gray-700 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map and Actions */}
        <section className="py-16 px-6 mt-20 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-12">Find Us</h2>
          <div className="max-w-6xl mx-auto">
            <p className="mb-4">
              Visit our branch or get in touch for more information.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href={branch.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                View on Map
              </a>
              <Link
                to="/branch"
                className="inline-block bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Back to Branches
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default BranchDetail;