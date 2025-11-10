import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUsersMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
import { redirect } from "react-router";
// ⚠️⚠️⚠️ don't forget this ⚠️⚠️⚠️⚠️
// import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUsersMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="pl-[10rem] pt-[3rem]">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* <AdminMenu /> */}
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {
                users.map((user)=>{
                  return (
                    <tr key={user._id}>
                    <td className="px-4 py-2">{user._id}</td>
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input type="text" value={editableUserName}
                           onChange={e => setEditableUserName(e.target.value)}
                           className="w-full p-2 border rounded-lg" />
                           <button 
                           onClick={ ()=> updateHandler(user._id)}
                            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg">
                              <FaCheck />
                           </button>
                        </div>
                      ):(
                        <div className="flex items-center">
                          {user.username} { " "}
                          <button onClick={()=>{
                            toggleEdit(user._id,user.username,user.email)
                          }}>
                            <FaEdit className="ml-[1rem]" />
                          </button>
                        </div>
                      )

                      }
                    </td>
                    <td className="px-4 py-2">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input type="text"
                         value={editableUserEmail}
                         onChange={e=> setEditableUserEmail(e.target.value)}
                         className="w-full p-2 border rounded-lg"/>
                          <button
                           onClick={()=> updateHandler(user.id)}
                           className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg">
                            <FaCheck />
                          </button>
                        </div>
                      ):(
                        <div className=" flex items-center">
                          {user.email}{" "}
                          <button onClick={()=>{
                            toggleEdit(user.id,user.username,user.email)
                          }}> <FaEdit className="ml-[1rem]" /> </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {!user.isAdmin && (
                        <div className="flex">
                          <button
                           onClick={()=>deleteHandler(user._id)}
                           className="bg-red-500 hover:bg-red-700text-white font-bold py-2 px-4 ">
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;