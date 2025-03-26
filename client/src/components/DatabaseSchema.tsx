export default function DatabaseSchema() {
  return (
    <section id="schema" className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Schema</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 mb-4">The API uses a PostgreSQL database hosted on Supabase with the following schema:</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Constraints</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">id</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SERIAL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PRIMARY KEY</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Auto-incrementing unique identifier</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">title</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TEXT</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NOT NULL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Task title (required)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">description</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TEXT</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NULL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Task description (optional)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">status</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TEXT</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">DEFAULT 'pending'</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Task status (default: 'pending')</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">SQL Create Statement</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto">
{`CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending'
);`}
          </pre>
        </div>
      </div>
    </section>
  );
}
