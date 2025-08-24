import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Events",
  "Academics",
  "General",
  "Fees",
  "Examination",
  "Sports",
];

export default function NewsFeed() {
  const [active, setActive] = useState("Events");
  const navigate = useNavigate();

  return (
    <div className="bg-white text-gray-900 min-h-screen">
     
      <div className="bg-[#EDEDED] px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-1 rounded hover:bg-gray-100 text-xl inline-flex items-center text-gray-700"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-xl font-semibold text-gray-900">Highlights</h1>
        </div>
      </div>

     
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        
        <nav className="border border-gray-300 rounded text-xs text-gray-700 mb-6 select-none">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-1">
            {CATEGORIES.map((cat, i) => (
              <li key={cat} className="flex items-center">
                <button
                  onClick={() => setActive(cat)}
                  className={`cursor-pointer px-1 py-0.5 rounded text-sm leading-none ${
                    active === cat
                      ? "text-orange-600 font-semibold"
                      : "text-gray-700 hover:underline"
                  }`}
                  aria-pressed={active === cat}
                >
                  {cat}
                </button>

                
                {i !== CATEGORIES.length - 1 && (
                  <span className="text-gray-400 mx-2 select-none">||</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

       
        <article className="mx-auto text-base leading-relaxed text-gray-900 max-w-3xl">
          
          <p className="text-center text-orange-600 font-bold text-3xl mb-2">
            PTA Meeting Scheduled for August 15
          </p>

          <p className="text-center text-gray-700 text-lg font-normal mb-6">
            Enhancing Home–School Collaboration for Student Success
          </p>

        
          <div className="flex justify-center gap-2 mb-6 text-sm">
            <div className="flex-1 max-w-[33%] border border-gray-300 rounded text-center px-2 py-1">
              Date: 12th August, 2025
            </div>
            <div className="flex-1 max-w-[33%] border border-gray-300 rounded text-center px-2 py-1">
              Time: 12:30pm
            </div>
            <div className="flex-1 max-w-[33%] border border-gray-300 rounded text-center px-2 py-1">
              Author: Gold Academy
            </div>
          </div>

        
          <p className="mb-4">
            In today’s rapidly evolving educational landscape, one thing remains
            constant: the success of a child in school is significantly
            influenced by the strength of the partnership between home and
            school. When parents, guardians, and educators work together,
            students receive the guidance, encouragement, and structure they
            need to thrive academically, emotionally, and socially.
          </p>

          <p className="font-semibold mb-1">
            Why Home–School Collaboration Matters
          </p>
          <p className="mb-2">
            Children learn best when they feel supported not just in the
            classroom, but also at home. When parents are involved in their
            child’s education, students are more likely to:
          </p>

          <ul className="list-disc list-inside mb-4">
            <li>Attend school regularly</li>
            <li>Complete homework consistently</li>
            <li>Achieve higher grades</li>
            <li>Demonstrate improved behavior and self-confidence</li>
            <li>Build positive attitudes toward school</li>
          </ul>

          <p className="mb-4">
            Strong collaboration also builds trust and transparency between
            parents and educators, helping resolve challenges early and ensuring
            each child’s unique needs are met.
          </p>

          <p className="font-semibold mb-1">
            What Collaboration Looks Like in Practice
          </p>
          <p className="mb-2">
            True home–school collaboration goes beyond occasional PTA meetings
            or report card days. It involves ongoing communication, shared
            goals, and joint efforts to support students holistically.
          </p>

          <p className="mb-2">Key practices include:</p>
          <ul className="list-disc list-inside mb-4">
            <li>
              Consistent Communication: Teachers sharing updates on student
              progress; parents providing feedback or context from home
            </li>
            <li>
              Participation in School Life: Parents attending school events,
              workshops, and volunteering when possible
            </li>
            <li>
              Supporting Learning at Home: Creating structured routines for
              homework, reading, and rest
            </li>
            <li>
              Mutual Respect and Understanding: Acknowledging each other’s role
              in a child’s development and working together without blame
            </li>
          </ul>

          <p className="font-semibold mb-1">
            How Schools Can Foster Better Collaboration
          </p>
          <p className="mb-2">To support parents and guardians, schools should:</p>

          <ul className="list-disc list-inside mb-4">
            <li>Provide accessible communication tools (like EduCat)</li>
            <li>Offer parent-teacher conferences and learning resources</li>
            <li>Create welcoming environments for parent involvement</li>
            <li>
              Encourage two-way communication, not just updates but also
              listening
            </li>
            <li>
              Recognize the diversity in family backgrounds and tailor support
              accordingly
            </li>
          </ul>

          <p className="font-semibold mb-1">Together, We Make the Difference</p>
          <p>
            Enhancing home–school collaboration isn’t just a strategy, it’s a
            commitment to the success and well-being of every child. When
            educators and families work as a team, students benefit from the
            power of united support systems. Let’s continue to build bridges
            that help our children succeed, not just in school, but in life.
          </p>
        </article>
      </div>
    </div>
  );
}
