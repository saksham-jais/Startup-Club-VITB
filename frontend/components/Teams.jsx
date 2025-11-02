import React, { useState } from "react";

// Team member data
const teamMembers = [
  {
    name: "LAKSHAY KHTOUR",
    title: "PRESIDENT",
    category: "Panel Members",
    batch: "23",
    image: "/team/Lakshay Khtour.jpg",
  },
  {
    name: "CHAITANYA GUPTA",
    title: "VICE PRESIDENT", 
    category: "Panel Members",
    batch: "23",
    image: "/team/Chaitanya Gupta.jpg",
  },
  {
    name: "FAROOQUE AZAM",
    title: "SECRETARY GENERAL",
    category: "Panel Members", 
    batch: "23",
    image: "/team/Farooque Azam.jpg",
  },
  {
    name: "VEEDUSHI JAIN",
    title: "CHAIRPERSON",
    category: "Panel Members",
    batch: "23", 
    image: "/team/Veedushi Jain.jpg",
  },
  {
    name: "DR LOKESH MALVIYA",
    title: "FACULTY COORDINATOR",
    category: "Faculty Coordinators",
    image: "/team/LokeshSir.jpg",
  },
  {
    name: "DR BHUPENDRA PANCHAL",
    title: "FACULTY COORDINATOR",
    category: "Faculty Coordinators",
    image: "/team/BhupendraSir.jpg",
  },
];

const filters = [
  "View all",
  "Panel Members",
  "Faculty Coordinators",
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
          Our Team
        </h3>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Meet the dedicated leaders driving innovation and entrepreneurship at our StartUp Club.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-100"
            />
            <h5 className="text-lg font-bold text-gray-800 mb-1">
              {member.name}
            </h5>
            <h6 className="text-sm text-blue-600 font-semibold mb-1">{member.title}</h6>
            
            {/* Conditionally render batch only for Panel Members */}
            {member.category === "Panel Members" && (
              <p className="text-xs text-gray-500 mb-3">Batch - {member.batch}</p>
            )}
            
            <ul className="flex space-x-4">
              <li>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-500 transition-transform duration-150 hover:-translate-y-1"
                >
                  <i className="icon-social-linkedin"></i>
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
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}