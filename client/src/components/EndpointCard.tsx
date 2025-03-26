interface Error {
  status: number;
  message: string;
}

interface EndpointCardProps {
  method: string;
  path: string;
  description: string;
  requestBody?: Record<string, any>;
  responseBody: Record<string, any> | Array<Record<string, any>>;
  curlExample: string;
  errors: Error[];
}

export default function EndpointCard({
  method,
  path,
  description,
  requestBody,
  responseBody,
  curlExample,
  errors
}: EndpointCardProps) {
  let methodColor = "";
  
  switch (method) {
    case "GET":
      methodColor = "bg-blue-100 text-blue-800";
      break;
    case "POST":
      methodColor = "bg-green-100 text-green-800";
      break;
    case "PUT":
      methodColor = "bg-yellow-100 text-yellow-800";
      break;
    case "DELETE":
      methodColor = "bg-red-100 text-red-800";
      break;
    default:
      methodColor = "bg-gray-100 text-gray-800";
  }

  return (
    <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium ${methodColor} mr-3`}>
            {method}
          </span>
          <h3 className="text-lg font-medium text-gray-900">{path}</h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
          {description}
        </span>
      </div>
      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {requestBody && (
            <>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Request Body</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                {JSON.stringify(requestBody, null, 2)}
              </pre>
            </>
          )}
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-4 mb-3">Response {requestBody ? "(200 OK)" : "(200 OK)"}</h4>
          <pre className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
            {JSON.stringify(responseBody, null, 2)}
          </pre>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Sample cURL Request</h4>
          <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
            {curlExample}
          </pre>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-4 mb-3">Errors</h4>
          <div className="bg-gray-100 p-3 rounded overflow-hidden">
            {errors.map((error, index) => (
              <div key={index} className={`flex items-center ${index !== errors.length - 1 ? 'mb-2' : ''}`}>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mr-2">
                  {error.status}
                </span>
                <span className="text-xs text-gray-700">{error.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
