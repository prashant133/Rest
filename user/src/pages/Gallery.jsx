import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const categories = [
  "All Photos",
  "Meetings",
  "Social Events",
  "Cultural Programs",
  "Workshops",
  "Ceremonies",
];

const photos = [
  {
    title: "Annual General Meeting 2024",
    date: "March 2024",
    category: "Meetings",
    image:
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Community Gathering",
    date: "February 2024",
    category: "Social Events",
    image:
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Board Members Meeting",
    date: "January 2024",
    category: "Meetings",
    image:
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Board Members Meeting",
    date: "January 2024",
    category: "Meetings",
    image:
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=800&q=80",
  },
];

function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All Photos");

  const filteredPhotos =
    activeCategory === "All Photos"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0c1c35] to-[#13284c] text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Gallery</h1>
        <p className="mt-2 text-lg">
          Capturing moments of our vibrant community life and activities
        </p>
      </section>

      {/* Filter Buttons */}
      <div className="py-8 px-6 max-w-7xl mx-auto flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded border font-semibold text-sm ${
              activeCategory === cat
                ? "bg-black text-white"
                : "bg-white border-black text-black hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <section className="px-6 pb-20 max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={idx}
            className="bg-white border rounded-md shadow-sm overflow-hidden"
          >
            <img
              src={photo.image}
              alt={photo.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-base mb-1">{photo.title}</h3>
              <div className="flex items-center text-sm text-gray-600 gap-2 mb-1">
                <FaCalendarAlt className="text-gray-500" />
                <span>{photo.date}</span>
              </div>
              <p className="text-sm text-gray-700">{photo.description}</p>
            </div>
          </div>
        ))}
      </section>
      {/* banner */}
      <section className="bg-black text-white text-center py-20 px-6">
        <h2 className="text-2xl font-bold mb-4">Share Your Memories</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Do you have photos from our events that you'd like to share? We'd love
          to add them to our gallery!
        </p>
        <button className="bg-white text-black px-5 py-2 rounded hover:bg-gray-100 transition font-semibold">
          Submit Photos
        </button>
      </section>
    </div>
  );
}

export default Gallery;
