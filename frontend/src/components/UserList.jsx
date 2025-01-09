import React from "react";

const UserList = ({ users }) => {
  return (
    <div className="flex space-x-4">
      {users.map((user, index) => (
        <div key={index} className="px-4 py-2 bg-blue-200 rounded">
          📌 {user}
        </div>
      ))}
    </div>
  );
};

export default UserList;
