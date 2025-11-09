import React from 'react'

const TeacheTable = () => {
  return (
    <div>
        {/* student table */}
        <h1 className="text-xl font-semibold mb-6">Student Table</h1>

        {/* student table */}
        <table>
            <thead>
                <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Student ID</th>
                    <th className="text-left p-3">Class</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="p-3 text-sm font-medium">John Smith</td>
                    <td className="p-3 text-sm">123456</td>
                    <td className="p-3 text-sm">Grade 12A</td>
                    <td className="p-3 text-sm">Active</td>
                    <td className="p-3 text-sm">View</td>
                </tr>
                <tr>
                    <td className="p-3 text-sm font-medium">Emma Johnson</td>
                    <td className="p-3 text-sm">789012</td>
                    <td className="p-3 text-sm">Grade 11B</td>
                    <td className="p-3 text-sm">Active</td>
                    <td className="p-3 text-sm">View</td>
                </tr>
                <tr>
                    <td className="p-3 text-sm font-medium">Michael Brown</td>
                    <td className="p-3 text-sm">345678</td>
                    <td className="p-3 text-sm">Grade 12A</td>
                    <td className="p-3 text-sm">Active</td>
                    <td className="p-3 text-sm">View</td>
                </tr>
                <tr>
                    <td className="p-3 text-sm font-medium">Emma Johnson</td>
                    <td className="p-3 text-sm">789012</td>
                    <td className="p-3 text-sm">Grade 11B</td>
                    <td className="p-3 text-sm">Active</td>
                    <td className="p-3 text-sm">View</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default TeacheTable