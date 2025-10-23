import React, { useState } from "react";

// Team member data
const teamMembers = [
  {
    name: "Emmy Rosum",
    title: "Co-Founder and CEO",
    category: "Management",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    name: "Orlando Diggs",
    title: "Co-Founder and COO",
    category: "Management",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Sophie Chamberlain",
    title: "Head of Sales",
    category: "Sales",
    image: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    name: "Lana Steiner",
    title: "VP of Customer Success",
    category: "Customer Success",
    image: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    name: "Emily Donnavan",
    title: "Product Lead",
    category: "Product",
    image: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    name: "Sasha Kindred",
    title: "VP of Marketing",
    category: "Marketing",
    image: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    name: "Jessica Dobrev",
    title: "Backend Lead",
    category: "Operations",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    name: "Drew Cano",
    title: "Head of UX",
    category: "Design",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
  },
];

const filters = [
  "View all",
  "Management",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Success",
  "Operations",
];

export default function TeamSection() {
  const [selectedFilter, setSelectedFilter] = useState("View all");

  const filteredMembers =
    selectedFilter === "View all"
      ? teamMembers
      : teamMembers.filter((m) => m.category === selectedFilter);

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto mt-10 font-montserrat bg-gray-50">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-medium text-gray-800 mb-3">
          Experienced & Professional Team
        </h3>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          You can rely on our amazing features list and also our customer services
          will be a great experience for you without doubt and in no-time.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all duration-150 ${
              selectedFilter === f
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h5 className="text-lg font-medium text-gray-800 mb-1">
              {member.name}
            </h5>
            <h6 className="text-sm text-gray-500 mb-3">{member.title}</h6>
            <p className="text-xs text-gray-500 mb-4">
              You can rely on our amazing features list and also our customer
              services will be a great experience.
            </p>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-500 transition-transform duration-150 hover:-translate-y-1"
                >
                  <i className="icon-social-facebook"></i>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-500 transition-transform duration-150 hover:-translate-y-1"
                >
                  <i className="icon-social-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-500 transition-transform duration-150 hover:-translate-y-1"
                >
                  <i className="icon-social-instagram"></i>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-500 transition-transform duration-150 hover:-translate-y-1"
                >
                  <i className="icon-social-behance"></i>
                </a>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}