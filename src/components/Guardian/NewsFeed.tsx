import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import React, { useState } from "react";

export default function Highlights() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const article = location.state?.article;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-4 md:ml-0">
        <div className="max-w-5xl mx-auto mt-15">
          <h1 className="font-bold text-base mb-3">Highlights</h1>

          <button
            aria-label="Back"
            className="mb-3 text-gray-700 hover:text-gray-900"
            onClick={() => navigate('/guardian/news')}
          >
            <FaArrowLeft />
          </button>

          {/* Article */}
          {article ? (
            <article className="bg-white mt-4 p-4 text-sm text-gray-900 leading-relaxed">
              <h2 className="text-orange-500 font-semibold text-center text-lg mb-1">
                {article.title}
              </h2>
              <h3 className="text-center font-normal mb-3">Category: {article.category}</h3>

              <section className="border border-gray-300 grid grid-cols-3 text-xs text-gray-900 mb-4">
                <div className="border-r border-gray-300 px-3 py-1">Date: {article.datePosted}</div>
                <div className="border-r border-gray-300 px-3 py-1 text-center">
                  Time: {article.time}
                </div>
                <div className="px-3 py-1 font-semibold text-right">Author: Gold Academy</div>
              </section>

              <div className="space-y-4">
                <p>
                  In today’s rapidly evolving educational landscape, one thing remains constant: the
                  success of a child in school is significantly influenced by the strength of the
                  partnership between home and school. When parents, guardians, and educators work
                  together, students receive the guidance, encouragement, and structure they need to
                  thrive academically, emotionally, and socially.
                </p>

                <h4 className="font-semibold">Why Home–School Collaboration Matters</h4>
                <p>
                  Children learn best when they feel supported not just in the classroom, but also
                  at home. When parents are involved in their child’s education, students are more
                  likely to:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Attend school regularly</li>
                  <li>Complete homework consistently</li>
                  <li>Achieve higher grades</li>
                  <li>Demonstrate improved behavior and self-confidence</li>
                  <li>Build positive attitudes toward school</li>
                </ul>
                <p>
                  Strong collaboration also builds trust and transparency between parents and
                  educators, helping resolve challenges early and ensuring each child’s unique needs
                  are met.
                </p>

                <h4 className="font-semibold">What Collaboration Looks Like in Practice</h4>
                <p>
                  True home–school collaboration goes beyond occasional PTA meetings or report card
                  days. It involves ongoing communication, shared goals, and joint efforts to
                  support students holistically.
                </p>
                <p>Key practices include:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Consistent Communication:</strong> Teachers sharing updates on student
                    progress; parents providing feedback or context from home
                  </li>
                  <li>
                    <strong>Participation in School Life:</strong> Parents attending school events,
                    workshops, and volunteering when possible
                  </li>
                  <li>
                    <strong>Supporting Learning at Home:</strong> Creating structured routines for
                    homework, reading, and rest
                  </li>
                  <li>
                    <strong>Mutual Respect and Understanding:</strong> Acknowledging each other’s
                    role in a child’s development and working together without blame
                  </li>
                </ul>

                <h4 className="font-semibold">How Schools Can Foster Better Collaboration</h4>
                <p>To support parents and guardians, schools should:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide accessible communication tools (like EduCat)</li>
                  <li>Offer parent-teacher conferences and learning resources</li>
                  <li>Create welcoming environments for parent involvement</li>
                  <li>Encourage two-way communication, not just updates but also listening</li>
                  <li>
                    Recognize the diversity in family backgrounds and tailor support accordingly
                  </li>
                </ul>

                <h4 className="font-semibold">Together, We Make the Difference</h4>
                <p>
                  Enhancing home–school collaboration isn’t just a strategy, it’s a commitment to
                  the success and well-being of every child. When educators and families work as a
                  team, students benefit from the power of united support systems. Let’s continue to
                  build bridges that help our children succeed, not just in school, but in life.
                </p>
              </div>
            </article>
          ) : (
            <p>No article data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
