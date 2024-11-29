import { getUserById } from "../actions";
import EditUserFrom from "./_components/edit-user-form";

type PageParams = Promise<{
  user_id: string;
}>;

export default async function AdminEditUserPage(props: { params: PageParams }) {
  const params = await props.params;
  const userInformation = await getUserById(params.user_id);
  const [userDetails, userAddresses] = [
    userInformation,
    userInformation.addresses,
  ];

  return <EditUserFrom userDetails={userDetails} addresses={userAddresses} />;
}
