// src/pages/Home.jsx
import { FaLightbulb, FaBullseye, FaAward } from "react-icons/fa";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0c1c35] to-[#13284c] text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-0">Welcome to R.E.S.T</h1>
        <p className="text-lg max-w-2xl mx-auto mt-2">
          Supporting retired telecommunications professionals with community,
          resources, and ongoing connections.
        </p>
      </section>

      {/* About Section */}
      <section className=" text-center py-16 px-6">
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
        <h2 className="text-3xl font-bold text-center mb-10">
          Upcoming Events
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Annual Meet 2025",
              date: "June 15, 2025",
              desc: "Join us for a grand reunion filled with memories, music, and meaningful moments.",
            },
            {
              title: "Health & Wellness Workshop",
              date: "July 8, 2025",
              desc: "A session focused on staying active and healthy in retirement.",
            },
          ].map(({ title, date, desc }) => (
            <div key={title} className="border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm italic mb-2">{date}</p>
              <p className="text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
