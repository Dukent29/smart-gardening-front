import { useState } from "react";
import { updateUserProfile } from "@/lib/userService";
import ProfilIcon from "@/assets/icons/big-profil.svg";
import { GiGardeningShears } from "react-icons/gi";
import EmailIcon from "@/assets/icons/mail.svg";
import UserIcon from "@/assets/icons/user.svg";
import { FaRegCalendar } from "react-icons/fa6";
 // Assuming you have a favorite quote icon


export default function UserInfo({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState({ field: null, value: "" });

  const startEdit = (field) => {
    setEditing({ field, value: user[field] });
  };

  const handleChange = (e) => {
    setEditing((prev) => ({ ...prev, value: e.target.value }));
  };

  const saveEdit = async () => {
    if (editing.value !== user[editing.field]) {
      try {
        const res = await updateUserProfile({
          [editing.field]: editing.value,
        });
        if (res.data.success) {
          setUser((prev) => ({ ...prev, [editing.field]: editing.value }));
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    setEditing({ field: null, value: "" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-4">
      <div className="text-5xl mb-2 flex flex-col items-center"><ProfilIcon /></div>
      <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
        <UserIcon  />
        {editing.field === "username" ? (
          <input
            className="border-b border-gray-300 outline-none"
            value={editing.value}
            autoFocus
            onChange={handleChange}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className="cursor-pointer hover:underline"
            onClick={() => startEdit("username")}
            title="Click to edit"
          >
            {user.username}
          </span>
        )}
      </div>
      <div className="text-gray-600 flex items-center gap-2 mt-1">
        <EmailIcon />
        {editing.field === "email" ? (
          <input
            className="border-b border-gray-300 outline-none"
            value={editing.value}
            autoFocus
            onChange={handleChange}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            type="email"
          />
        ) : (
          <span
            className="cursor-pointer hover:underline"
            onClick={() => startEdit("email")}
            title="Click to edit"
          >
            {user.email}
          </span>
        )}
      </div>
      <div className="text-gray-600 flex items-center gap-2 mt-1 ">
        <GiGardeningShears className="text-2xl" />
        <span>{user.role}</span>
      </div>
      <div className="text-gray-600 flex items-center gap-2 mt-1">
        <FaRegCalendar className="text-2xl" />
        <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}