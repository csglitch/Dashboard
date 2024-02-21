// import { createSignal, onCleanup } from "solid-js";
// import { User } from "./types"; // Assuming you have a User type defined
import users from "../assets/users"
const AdminPage = () => {
//   const [users, setUsers] = createSignal<User[]>([]);

//   // Fetch users when the component mounts
//   onCleanup(() => {
//     getUsers().then((data) => {
//       setUsers(data);
//     });
//   });

const allUsers = users ;
console.log("type of allUsers",  allUsers)

  return (
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold my-4">Users</h1>
      <ul class="divide-y divide-gray-200">
        {allUsers.map((user) => (
          <li class="py-4 user-card" >
            <div class="flex items-center space-x-4">
                {/* Image of the user */}
              <div class="flex-shrink-0">
                {/* <img
                  class="h-8 w-8 rounded-full"
                  src={user.avatar}
                  alt={user.name}
                /> */}
              </div>
              {/* information of the user */}
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {user.firstname}
                </p>
                <p class="text-sm font-medium text-gray-900 truncate">
                  {user.lastname}
                </p>
                <p class="text-sm text-gray-500 truncate">{user.email}</p>
                <p class="text-sm text-gray-500 truncate">{user.phonenumber}</p>
              </div>
            </div>
          </li>
         ))} 
      </ul>
    </div>
  );
};

export default AdminPage;
