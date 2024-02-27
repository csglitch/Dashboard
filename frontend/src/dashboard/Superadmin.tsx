import { createSignal, createEffect } from "solid-js";

function SuperAdminPage() {
  console.log("Superadmin page");
  const [adminAccessRequests, setAdminAccessRequests] = createSignal([]);

  const fetchAdminAccessRequests = async () => {
    try {
      const response = await fetch("http://localhost:4000/adminaccessreq", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAdminAccessRequests(data);
      } else {
        console.error("Failed to fetch admin access requests");
      }
    } catch (error) {
      console.error("Error fetching admin access requests:", error);
    }
  };

  createEffect(() => {
    fetchAdminAccessRequests();
  }, []);

  const adminAccess = async (email: string, decision: string) => {
    try {
      const response = await fetch("http://localhost:4000/superadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, decision }),
      });

      if (response.ok) {
        console.log(`Request processed for ${email}`);
        fetchAdminAccessRequests();
      } else {
        console.error("Failed to deny admin access");
      }
    } catch (error) {
      console.error("Error denying admin access:", error);
    }
  };

  return (
    <div>
      <h2>Admin Access Requests</h2>
      {adminAccessRequests().map((data: { email: string }) => (
        <div>
          <p>Email: {data.email}</p>
          <button onClick={() => adminAccess(data.email, "approve")}>
            Approve
          </button>
          <button onClick={() => adminAccess(data.email, "deny")}>Deny</button>
        </div>
      ))}
    </div>
  );
}

export default SuperAdminPage;
