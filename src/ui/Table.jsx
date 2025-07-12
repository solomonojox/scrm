export function Table() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Sample Data
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              Active
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}