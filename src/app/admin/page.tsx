export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your FreeImage portal</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Images
            </h3>
            <p className="text-3xl font-bold text-blue-600">4</p>
            <p className="text-sm text-gray-500">Sample images</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Categories
            </h3>
            <p className="text-3xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-500">Active categories</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Downloads
            </h3>
            <p className="text-3xl font-bold text-purple-600">3,540</p>
            <p className="text-sm text-gray-500">Total downloads</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Generated
            </h3>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/ai-generator"
              className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 text-center"
            >
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold mb-1">AI Generator</h3>
              <p className="text-sm opacity-90">Create AI images</p>
            </a>
            
            <div className="bg-gray-100 text-gray-500 p-6 rounded-lg text-center">
              <div className="text-2xl mb-2">📁</div>
              <h3 className="font-semibold mb-1">Manage Images</h3>
              <p className="text-sm">Coming soon</p>
            </div>
            
            <div className="bg-gray-100 text-gray-500 p-6 rounded-lg text-center">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-semibold mb-1">Manage Categories</h3>
              <p className="text-sm">Coming soon</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">System initialized</p>
                <p className="text-sm text-gray-500">Project setup completed</p>
              </div>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Sample data loaded</p>
                <p className="text-sm text-gray-500">Categories and images added</p>
              </div>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-500"
          >
            ← View Website
          </a>
          
          <a
            href="/admin/login"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  )
} 