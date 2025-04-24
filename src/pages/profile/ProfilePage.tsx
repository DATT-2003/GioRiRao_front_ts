import { useEffect, useState } from "react";
import profileApi from "../../features/profile/api/profileApi";
import authApi from "../../features/authentication/authApi";
import { IProfile } from "../../features/profile/types/profileTypes";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userInfo = await authApi.getMeInfo();
        if (!userInfo) throw new Error("User info not found");
        const { userId } = userInfo;
        if (!userId) throw new Error("User ID not found");

        const profileData = await profileApi.getById(userId);
        setProfile(profileData);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load your profile information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

    if (loading || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">
          {error ? error : "Loading your profile..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-400">
          My Profile
        </h1>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`Avatar of ${profile.name}`}
              className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-600 rounded-full text-white text-sm text-center px-2">
              No avatar
            </div>
          )}

          <div className="flex-1 space-y-4 text-base">
            <p className="flex items-center gap-3">
              <UserCircle className="w-5 h-5 text-blue-400" />
              <span>
                <strong>Name:</strong> {profile.name}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-yellow-400" />
              <span>
                <strong>Email:</strong> {profile.email}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-400" />
              <span>
                <strong>Phone:</strong> {profile.phone}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-400" />
              <span>
                <strong>Address:</strong> {profile.address}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>
                <strong>Role:</strong> {profile.role}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}