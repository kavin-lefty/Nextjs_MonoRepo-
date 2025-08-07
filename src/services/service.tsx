import axios from "axios";
interface FetchUsersPayload {
  strPage: string;
  strSearch?: string;
}
export const FetchUsers = async (data: FetchUsersPayload) => {
  const res = await axios.post("/api/user/list", data);
  return res.data;
};
