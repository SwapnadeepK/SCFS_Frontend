import { useEffect, useState } from "react";
import API from "../../api/axios";

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [role] = useState("VTU_ADMIN"); // or get from user context

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await API.get(`/roles/${role}/menu`);
        setPermissions(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch permissions:", err);
      }
    };

    fetchPermissions();
  }, [role]);

  return (
    <div>
      <h2>Permissions</h2>

      {permissions.length > 0 ? (
        permissions.map((p, index) => (
          <div key={index}>
            {p.name} - {p.path}
          </div>
        ))
      ) : (
        <p>No permissions found</p>
      )}
    </div>
  );
};

export default Permissions;