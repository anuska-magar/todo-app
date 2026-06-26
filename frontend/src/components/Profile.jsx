// components/Profile.jsx
import { User, Mail, Calendar, CheckCircle, Clock } from "lucide-react";

function Profile({ user, totalCount = 0, completedCount = 0 }) {
  if (!user) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-gray-200 p-3 rounded-xl">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Guest User</h2>
            <p className="text-sm text-gray-500">Please login to see your profile</p>
          </div>
        </div>
      </div>
    );
  }

  const remaining = totalCount - completedCount;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-6 mb-6 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Avatar */}
        <div className="p-4 rounded-xl shadow-lg" style={{ backgroundColor: "#18181b" }}>
          <User className="w-10 h-10 text-white" />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-gray-800">
              {user.name}
            </h2>
            {user.role && (
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {user.role}
              </span>
            )}
          </div>

          <div className="mt-1.5 space-y-1">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm">Joined {user.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {totalCount > 0 && (
          <div className="flex gap-4 bg-gray-50 px-4 py-2 rounded-xl">
            <div className="text-center">
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold">{completedCount}</span>
              </div>
              <p className="text-xs text-gray-500">Done</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{remaining}</span>
              </div>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;