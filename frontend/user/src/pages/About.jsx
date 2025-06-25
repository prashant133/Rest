// src/pages/About.jsx

import {
  FaUsers,
  FaBuilding,
  FaHandsHelping,
  FaLightbulb,
  FaBullseye,
  FaAward,
} from "react-icons/fa";
import rest from '../assets/rest.jpg'

function About() {
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

      {/* Main Content */}
      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side: Intro Text */}
          <div>
            <h1 className="text-3xl font-bold mb-6">Welcome to R.E.S.T</h1>
            <p className="mb-4">
              <strong>R.E.S.T (Retired Employees Support Trust)</strong> is a
              vibrant community organization dedicated to supporting retired
              telecommunications professionals throughout their golden years.
              Since our establishment, we have been committed to fostering
              connections, providing support, and creating meaningful
              opportunities for our members.
            </p>
            <p className=" mb-4">
              Our organization was born from the recognition that retirement
              should not mean isolation or disconnection from the professional
              community that shaped our careers. Instead, it should be a time of
              continued growth, friendship, and mutual support.
            </p>
            <p className="">
              We believe that the knowledge, experience, and wisdom of our
              retired members are invaluable assets that should be celebrated
              and shared. Through our various programs and initiatives, we
              create platforms for meaningful engagement and lasting
              relationships.
            </p>
          </div>

          {/* Right Side: Features */}
          <div className="space-y-6">
            {[
              {
                icon: <FaUsers size={24} />,
                title: "Strong Community",
                desc: "Over 500+ active retired members from various telecommunications backgrounds",
              },
              {
                icon: <FaBuilding size={24} />,
                title: "Established Presence",
                desc: "Headquartered in Kathmandu with outreach programs across Nepal",
              },
              {
                icon: <FaHandsHelping size={24} />,
                title: "Support Network",
                desc: "Comprehensive support system including healthcare, social activities, and financial guidance",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className=" border border-gray-700 rounded-lg p-5"
              >
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

        {/* Full-width Vision, Mission, Value Section */}
        <section className="py-16 px-6 mt-20 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vision, Mission and Value
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: (
                  <FaLightbulb size={36} className="text-yellow-400 mb-4" />
                ),
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
        {/* members */}
        <section className="py-20 px-6 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Board Members
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "Rakesh Adhikari",
                role: "President",
                bio: "25+ years in telecommunications with expertise in network infrastructure and management.",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Nabin Thapa",
                role: "Vice President",
                bio: "Former regional director with extensive experience in telecommunications policy.",
                image: "https://randomuser.me/api/portraits/men/33.jpg",
              },
              {
                name: "Deepak Shrestha",
                role: "Secretary",
                bio: "20 years experience in administrative management and organizational leadership.",
                image: "https://randomuser.me/api/portraits/men/34.jpg",
              },
              {
                name: "Sumitra Pokharel",
                role: "Treasurer",
                bio: "Financial management specialist with background in telecommunications budgeting.",
                image: "https://randomuser.me/api/portraits/women/33.jpg",
              },
              {
                name: "Rajesh Gurung",
                role: "Member",
                bio: "Technical specialist with expertise in network infrastructure design and implementation.",
                image: "https://randomuser.me/api/portraits/men/35.jpg",
              },
              {
                name: "Kabita Adhikari",
                role: "Member",
                bio: "Communications specialist with focus on community engagement and outreach programs.",
                image: "https://randomuser.me/api/portraits/women/36.jpg",
              },
              {
                name: "Bishal Magar",
                role: "Member",
                bio: "Former operations manager with expertise in organizational development and project execution.",
                image: "https://randomuser.me/api/portraits/men/37.jpg",
              },
              {
                name: "Hari Gurung",
                role: "Member",
                bio: "Human resources expert specializing in retiree affairs and welfare programs.",
                image: "https://randomuser.me/api/portraits/men/38.jpg",
              },
            ].map(({ name, role, bio, image }) => (
              <div
                key={name}
                className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
              >
                <div
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm">{role}</p>
                  </div>
                </div>
                <div className="p-4 text-gray-700 text-sm">{bio}</div>
              </div>
            ))}
          </div>
        </section>
        {/* message from presedint */}
        <section className="py-20 px-6 bg-white text-gray-800">
          <h2 className="text-3xl font-bold text-center mb-12">
            Message from Our President
          </h2>
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-start">
            {/* Message Text */}
            <div className="md:col-span-2 space-y-6">
              <p className="font-semibold">
                Respected members, greetings and salutations!
              </p>
              <p>
                It brings me immense joy to welcome you to our R.E.S.T community
                website. As we navigate through our golden years, it's important
                to remember that retirement is not an end, but a new beginning
                filled with opportunities for growth, connection, and
                contribution to our society.
              </p>
              <p>
                Our organization stands as a testament to the enduring bonds
                forged through years of dedicated service in the
                telecommunications industry. The knowledge and experience we
                have accumulated over decades of service are invaluable assets
                that we must continue to share and celebrate.
              </p>
              <p>
                Through R.E.S.T, we have created a platform where retired
                professionals can continue to engage meaningfully with their
                peers, participate in community development activities, and
                maintain the professional relationships that have enriched our
                lives.
              </p>
              <p>
                I encourage each of you to actively participate in our events,
                share your stories and experiences, and help us build an even
                stronger community for current and future retirees. Together, we
                can ensure that our retirement years are not just comfortable,
                but truly fulfilling.
              </p>
              <p className="font-semibold">
                Thank you for being part of this wonderful journey.
              </p>
              <div>
                <p className="font-bold">Rakesh Adhikari</p>
                <p>President, R.E.S.T</p>
              </div>
            </div>

            {/* President Card */}
            <div className="bg-gray-50 rounded-lg shadow text-center p-6">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Rakesh Adhikari"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">Rakesh Adhikari</h3>
              <p className="text-sm text-gray-500 mb-2">President</p>
              <p className="text-sm text-gray-600">
                Leading R.E.S.T with dedication and vision for community
                excellence
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
