import { getUserById } from "../actions";
import EditUserFrom from "./_components/edit-user-form";



export default async function AdminEditUserPage({
  params,

}: {
  params: {
    user_id: string;
  };
 
}) {
  const { user_id } = params;



  const userInformation = await getUserById(user_id);
  const  [userDetails, userAddresses] = [userInformation, userInformation.addresses];
  return (
   <EditUserFrom userDetails={userDetails} addresses={userAddresses} />
  );
}
