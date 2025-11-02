import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const API_BASE = "http://localhost:5000/api";
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser);
  const [form, setForm] = useState(storedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUser(storedUser);
    setForm(storedUser);
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg"].includes(file.type)) {
      return setError("Only JPEG images allowed");
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(`${API_BASE}/auth/profile/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const newPic = res.data.data.profilePic;
      const fullUrl = `${API_BASE.replace("/api", "")}${newPic}`;
      setPhotoPreview(fullUrl);
      setForm((prev) => ({ ...prev, profilePic: newPic }));
      localStorage.setItem("user", JSON.stringify({ ...storedUser, profilePic: newPic }));
      setError("");
    } catch {
      setError("Image upload failed");
    }
  };

  const handleSave = async () => {
    setMessage("");
    setError("");
    try {
      const payload = {
        username: form.username,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined,
        goals: form.goals,
      };
      const res = await axios.put(`${API_BASE}/auth/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = { ...user, ...res.data.data };
      setUser(updated);
      setForm(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      setError("Update failed. Please try again.");
    }
  };

  const avatarSrc =
    photoPreview ||
    (user?.profilePic
      ? user.profilePic.startsWith("http")
        ? user.profilePic
        : `${API_BASE.replace("/api", "")}${user.profilePic}`
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/40 transition-all duration-300 hover:shadow-blue-300">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-8 tracking-wide">
          {isEditing ? "Edit Profile" : "Your Profile"}
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg shadow-blue-200">
              <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            </div>
            {isEditing && (
              <label className="cursor-pointer text-sm text-blue-700 hover:text-blue-900 font-medium">
                Change Photo
                <input
                  type="file"
                  accept="image/jpeg,image/jpg"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 w-full">
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-100 text-green-700 p-2 rounded mb-3 text-sm text-center">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Username", name: "username", type: "text" },
                { label: "Age", name: "age", type: "number" },
                { label: "Weight (kg)", name: "weight", type: "number" },
                { label: "Height (cm)", name: "height", type: "number" },
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-gray-600 text-sm mb-1">{field.label}</label>
                  {isEditing ? (
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={onChange}
                      className="w-full border border-blue-200 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {user[field.name] || "—"}
                    </p>
                  )}
                </div>
              ))}

              {/* Goals */}
              <div className="md:col-span-2">
                <label className="block text-gray-600 text-sm mb-1">Goals</label>
                {isEditing ? (
                  <textarea
                    name="goals"
                    value={form.goals || ""}
                    onChange={onChange}
                    className="w-full border border-blue-200 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition"
                  />
                ) : (
                  <p className="font-medium text-gray-800 min-h-[40px]">
                    {user.goals || "—"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-300 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setForm(user);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-2 rounded-lg font-medium shadow-lg shadow-blue-300 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
