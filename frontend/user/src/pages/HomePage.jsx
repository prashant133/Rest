  import { useState, useEffect } from "react";
import { FaLightbulb, FaBullseye, FaAward } from "react-icons/fa";
import axios from "axios";
import rest from '../assets/rest.jpg';

const api_base_url = import.meta.env.VITE_API_URL;

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${api_base_url}/api/v1/event/get-all-event`,
          { withCredentials: true }
        );
        if (response.data.success) {
          const upcomingEvents = response.data.data.filter((event) => {
            const eventDate = new Date(event.date);
            const today = new Date();
            return eventDate >= today;
          });
          setEvents(upcomingEvents);
          setError(null);
        } else {
          setError("Failed to fetch events");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="py-20 " // Added mt-16 for header clearance
        style={{
          backgroundImage: `url(${rest})`,
          backgroundSize: 'cover', // Cover full width
          backgroundPosition: 'center 20%', // Shift image down
          backgroundRepeat: 'no-repeat', // Prevent tiling
          backgroundBlendMode: 'overlay', // Blend with gradient
          // backgroundColor: '#0c1c35', // Solid color fallback
          position: 'relative', // For overlay
          minHeight: '80vh', // Ensure height
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          {/* Empty as per previous request */}
        </div>
      </section>

      {/* About Section */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl font-semibold mb-6">About Our Community</h2>
        <p className="max-w-3xl mx-auto leading-relaxed">
          R.E.S.T is a vibrant community dedicated to supporting retired
          telecommunications professionals. We provide a platform for continued
          connection, shared experiences, and mutual support among our members.
          Our organization has been serving the telecommunications community for
          years, fostering relationships and creating opportunities for
          meaningful engagement in retirement.
        </p>
        <a
          href="/aboutus"
          className="mt-6 inline-block bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
        >
          Learn More About Us →
        </a>
      </section>

      {/* Vision, Mission, Value */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Vision, Mission and Value
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <FaLightbulb size={36} className="text-yellow-400 mb-4" />,
              title: "Vision",
              text: `To create a supportive and engaging community where retired telecommunications professionals can continue to thrive, share knowledge, and maintain meaningful connections throughout their golden years.`,
            },
            {
              icon: <FaBullseye size={36} className="text-blue-400 mb-4" />,
              title: "Mission",
              text: `To provide comprehensive support, resources, and opportunities for social engagement to our retired members, fostering a sense of belonging and continued purpose in the community.`,
            },
            {
              icon: <FaAward size={36} className="text-green-400 mb-4" />,
              title: "Value",
              text: `We value respect, integrity, community support, and the wisdom that comes with experience. Our commitment is to honor the contributions of our members and create lasting relationships.`,
            },
          ].map(({ icon, title, text }) => (
            <div
              key={title}
              className="border border-gray-700 p-6 rounded-lg text-center"
            >
              {icon}
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Upcoming Events</h2>
        {loading && (
          <div className="text-center py-10">
            <p>Loading events...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-10 text-red-600">
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event._id}
                  className="border border-gray-700 rounded-lg p-6"
                >
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm italic mb-2">{event.date}</p>
                  <p className="text-sm">{event.description}</p>
                  {event.files.length > 0 &&
                    event.files[0].type.startsWith("image/") && (
                      <img
                        src={event.files[0].url}
                        alt={event.title}
                        className="mt-4 w-full h-32 object-cover rounded"
                      />
                    )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-2">
                No upcoming events found.
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;