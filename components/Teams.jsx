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
    <section className="py-12 px-4 max-w-6xl mx-auto my-15">
      <h2 className="text-3xl text-center font-serif font-light">
        Meet the team that makes the <span className="italic">magic</span> happen
      </h2>
      <p className="text-center mt-2 text-gray-500">
        Meet our diverse team of world-class creators, designers, and problem solvers.
      </p>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-3 py-1 rounded border text-sm min-w-24
              ${
                selectedFilter === f
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              }
              transition duration-150`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mt-12">
        {filteredMembers.map((member, idx) => (
<div
  key={member.name}
  className={`relative flex items-end

    rounded-[18px] shadow-[0_6px_22px_0_rgba(40,40,40,0.10)]
    overflow-hidden transition-transform duration-300 hover:scale-105`}
  style={{
    width: "270px",
    height: "330px",
    margin: "auto",
    background: "#ddd",
    cursor: "pointer",
  }}
>
  {/* Full-card background image */}
  <img
    src={member.image}
    alt={member.name}
    className="absolute inset-0 w-full h-full object-cover"
    style={{
      zIndex: 1
    }}
  />
  {/* Bottom glassmorphism title block */}
  <div
    className="relative z-10 w-[95%] mx-2 mb-2 py-2 px-1 flex flex-col items-center"
    style={{
      background: "rgba(255,255,255,0.65)",
      backdropFilter: "blur(7px)",
      borderRadius: "14px",
      boxShadow: "0 2.5px 10px 0 rgba(80,80,80,0.13)",
    }}
  >
    <div className="font-bold text-base text-gray-900 text-center leading-snug">
      {member.name}
    </div>
    <div className="text-gray-700 text-sm text-center font-medium" style={{marginTop: 2}}>
      {member.title}
    </div>
  </div>
</div>


        ))}
      </div>
    </section>
  );
}
