// import { createSignal, onCleanup } from "solid-js";
// import { User } from "./types"; // Assuming you have a User type defined
import users from "../assets/users"
const UsersPage = () => {
//   const [users, setUsers] = createSignal<User[]>([]);

//   // Fetch users when the component mounts
//   onCleanup(() => {
//     getUsers().then((data) => {
//       setUsers(data);
//     });
//   });

  return (
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold my-4">Hi i am user...</h1>
      
    </div>
  );
};

export default UsersPage;
