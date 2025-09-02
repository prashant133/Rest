
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
        className="py-20"
        style={{
          backgroundImage: `url(${rest})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'overlay',
          position: 'relative',
          minHeight: '80vh',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
        <div className="relative z-10">
          <div className="container mx-auto px-6 text-center text-white">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
              style={{
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 0, 0, 0.5)',
                opacity: 0.95,
              }}
            >
              Nepal Telecommunication Retired Employees Society (REST)
            </h1>
            <p
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{
                textShadow: '1px 1px 6px rgba(0, 0, 0, 0.7)',
                opacity: 0.90,
              }}
            >
              Safeguarding the welfare of retired telecom professionals and harnessing their expertise for national development.
            </p>
          </div>
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
              text: `To create a supportive platform where retired telecommunications professionals can thrive, share their expertise, and contribute to national development and social welfare.`,
            },
            {
              icon: <FaBullseye size={36} className="text-blue-400 mb-4" />,
              title: "Mission",
              text: `To safeguard the welfare of retired employees through income-generating programs, skill enhancement, advocacy for rights, and facilitation of their involvement in telecom-related initiatives and disaster response.`,
            },
            {
              icon: <FaAward size={36} className="text-green-400 mb-4" />,
              title: "Value",
              text: `We value respect, integrity, community support, and the wisdom of experience. Our commitment includes honoring contributions, promoting entitlements, and collaborating with similar organizations for consumer rights and sector coordination.`,
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
