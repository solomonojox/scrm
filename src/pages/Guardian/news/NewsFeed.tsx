import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect } from "react";

export default function NewsFeed() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const article = location.state?.article;

  return (
    <div className="mx-4 md:mx-0">
      <div className="flex justify-between items-center mb-4 relative mt-4 md:mt-20">
        <div className="space-y-3 my-1">
          <h1 className="font-bold text-base flex-1 md:text-left">Highlights</h1>

          <div
            title="back"
            className="mb-3 text-gray-900 hover:text-gray-700 cursor-pointer"
            onClick={() => navigate("/guardian/news")}
          >
            <FaArrowLeft className="w-4 h-4" />
          </div>
        </div>
      </div>

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
              Children learn best when they feel supported not just in the classroom, but also at
              home. When parents are involved in their child’s education, students are more likely
              to:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Attend school regularly</li>
              <li>Complete homework consistently</li>
              <li>Achieve higher grades</li>
              <li>Demonstrate improved behavior and self-confidence</li>
              <li>Build positive attitudes toward school</li>
            </ul>
            <p>
              Strong collaboration also builds trust and transparency between parents and educators,
              helping resolve challenges early and ensuring each child’s unique needs are met.
            </p>

            <h4 className="font-semibold">What Collaboration Looks Like in Practice</h4>
            <p>
              True home–school collaboration goes beyond occasional PTA meetings or report card
              days. It involves ongoing communication, shared goals, and joint efforts to support
              students holistically.
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
                <strong>Mutual Respect and Understanding:</strong> Acknowledging each other’s role
                in a child’s development and working together without blame
              </li>
            </ul>

            <h4 className="font-semibold">How Schools Can Foster Better Collaboration</h4>
            <p>To support parents and guardians, schools should:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide accessible communication tools (like EduCat)</li>
              <li>Offer parent-teacher conferences and learning resources</li>
              <li>Create welcoming environments for parent involvement</li>
              <li>Encourage two-way communication, not just updates but also listening</li>
              <li>Recognize the diversity in family backgrounds and tailor support accordingly</li>
            </ul>

            <h4 className="font-semibold">Together, We Make the Difference</h4>
            <p>
              Enhancing home–school collaboration isn’t just a strategy, it’s a commitment to the
              success and well-being of every child. When educators and families work as a team,
              students benefit from the power of united support systems. Let’s continue to build
              bridges that help our children succeed, not just in school, but in life.
            </p>
          </div>
        </article>
      ) : (
        <p>No article data found.</p>
      )}
    </div>
  );
}
