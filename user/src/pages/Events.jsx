import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

function Events() {
  const events = [
    {
      title: "Monthly General Meeting",
      desc: "Our regular monthly meeting to discuss community matters, share updates, and plan upcoming activities. All members are encouraged to attend.",
      date: "June 15, 2024",
      time: "10:00 AM - 12:00 PM",
      location: "R.E.S.T Central Office, Kathmandu",
    },
    {
      title: "Health and Wellness Workshop",
      desc: "A comprehensive workshop focusing on health management during retirement years. Topics include nutrition, exercise, and mental wellness.",
      date: "June 22, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Community Center, Bhaktapur",
    },
    {
      title: "Annual Picnic and Recreation Day",
      desc: "Join us for a day of fun, food, and fellowship at our annual picnic. Bring your families and enjoy recreational activities.",
      date: "July 5, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Shivapuri National Park",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0c1c35] to-[#13284c] text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-2">Events & Activities</h1>
        <p className="text-lg">
          Stay connected with our community through regular events and
          activities
        </p>
      </section>

      {/* Events Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Upcoming Events
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Monthly General Meeting",
              desc: "Our regular monthly meeting to discuss community matters, share updates, and plan upcoming activities. All members are encouraged to attend.",
              date: "June 15, 2024",
              time: "10:00 AM - 12:00 PM",
              location: "R.E.S.T Central Office, Kathmandu",
              audience: "All Members",
            },
            {
              title: "Health and Wellness Workshop",
              desc: "A comprehensive workshop focusing on health management during retirement years. Topics include nutrition, exercise, and mental wellness.",
              date: "June 22, 2024",
              time: "2:00 PM - 4:00 PM",
              location: "Community Center, Bhaktapur",
              audience: "Open to All",
            },
            {
              title: "Annual Picnic and Recreation Day",
              desc: "Join us for a day of fun, food, and fellowship at our annual picnic. Bring your families and enjoy recreational activities.",
              date: "July 5, 2024",
              time: "9:00 AM - 5:00 PM",
              location: "Shivapuri National Park",
              audience: "Members & Families",
            },
          ].map((event, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{event.desc}</p>
                <ul className="text-sm space-y-2 text-gray-800">
                  <li className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-600" />
                    {event.date}
                  </li>
                  <li className="flex items-center gap-2">
                    <FaClock className="text-gray-600" />
                    {event.time}
                  </li>
                  <li className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-600" />
                    {event.location}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 14s1-1 6-1 6 1 6 1v1H4v-1z" />
                    </svg>
                    {event.audience}
                  </li>
                </ul>
              </div>
              <button className="mt-6 bg-black text-white text-sm font-semibold py-2 rounded hover:bg-gray-800 transition">
                Register Now
              </button>
            </div>
          ))}
        </div>
      </section>
      {/* current disscussion */}
      <section className="py-20 px-6 bg-white text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">
          Current Discussions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "Healthcare Benefits Discussion",
              desc: "Discussion regarding enhanced healthcare benefits for retired members. We are exploring partnerships with local hospitals for better medical care coverage.",
              status: "Ongoing",
            },
            {
              title: "Pension Fund Updates",
              desc: "Updates on pension fund management and distribution policies. Members will be informed about recent changes and future planning.",
              status: "Under Review",
            },
            {
              title: "Community Center Renovation",
              desc: "Plans for renovating our community center to make it more accessible and comfortable for all members, especially elderly participants.",
              status: "Planning Phase",
            },
            {
              title: "Digital Literacy Program",
              desc: "Initiative to help members become more comfortable with digital technology and online communication platforms.",
              status: "Proposed",
            },
          ].map(({ title, desc, status }, idx) => (
            <div
              key={idx}
              className="bg-white border rounded-lg p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-700 mb-4">{desc}</p>
                <p className="font-semibold text-sm">
                  Status: <span className="font-normal">{status}</span>
                </p>
              </div>
              <button className="mt-6 border border-black text-black px-4 py-2 rounded hover:bg-gray-100 text-sm font-semibold transition">
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Feedback CTA */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-gray-700">
            Have suggestions or concerns? We value your input!
          </p>
          <button className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 text-sm font-semibold">
            Submit Feedback
          </button>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-20 text-gray-800">
        {/* Recent Events Header */}
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Recent Events</h2>
          <button className="border border-black text-black px-4 py-2 rounded hover:bg-gray-100 text-sm font-semibold transition">
            View All Events
          </button>
        </div>

        {/* Event Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[
            {
              title: "Financial Planning Seminar",
              desc: "Educational seminar on retirement financial planning and investment strategies.",
              date: "May 20, 2024",
              members: "45 members",
            },
            {
              title: "Cultural Program",
              desc: "Traditional music and dance performances celebrating Nepali culture and heritage.",
              date: "May 10, 2024",
              members: "60 members",
            },
            {
              title: "Technology Workshop",
              desc: "Introduction to smartphones and digital communication for senior citizens.",
              date: "April 28, 2024",
              members: "30 members",
            },
          ].map(({ title, desc, date, members }, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-700 mb-4">{desc}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{date}</span>
                <span>{members}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stay Connected Banner */}
      <section className="bg-black text-white text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Don’t miss out on any of our events and activities. Join our community
          and stay informed about all upcoming programs.
        </p>
        <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-100 transition">
          Join Our Newsletter
        </button>
      </section>
    </div>
  );
}

export default Events;
