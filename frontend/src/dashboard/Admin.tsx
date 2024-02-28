import { createSignal, onCleanup, onMount } from "solid-js";
import { User } from "../assets/users";
import SuperAdminPage from "./Superadmin";
import { globalRole } from "../signals/signals";

const AdminPage = () => {
  const allUsers: User[] = [];

  let [data, setData] = createSignal<User[]>([]);

  const requestAdminAccess = async (email: String) => {
    try {
      const response = await fetch("http://localhost:4000/reqadmin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // console.log("Admin access requested successfully");
      } else {
        console.error("Failed to request admin access");
      }
    } catch (error) {
      console.error("Error requesting admin access:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/dashboard", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      // console.log(globalRole());
      const data: User[] = await response.json();
      allUsers.length = 0;
      allUsers.push(...data);
      setData(allUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();

  return (
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold my-4">Users</h1>
      <ul class="divide-y divide-gray-200">
        {data().map((user: User) => (
          <li class="py-4 user-card">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  First Name: {user.firstName}
                </p>
                <p class="text-sm font-medium text-gray-900 truncate">
                  Last Name: {user.lastName}
                </p>
                <p class="text-sm text-gray-500 truncate">
                  Email id: {user.email}
                </p>
                <p class="text-sm text-gray-500 truncate">
                  Mobile No: {user.mobileNo}
                </p>
                {user.role === "user" && (
                  <button onClick={() => requestAdminAccess(user.email)}>
                    Request Admin Access
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {globalRole() === "superadmin" && <SuperAdminPage />}
    </div>
  );
};

export default AdminPage;
