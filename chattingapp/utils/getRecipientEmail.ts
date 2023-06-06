import { Conversation } from "@/types";
import { User } from "firebase/auth";

export const getRecipientEmail = (
  conversationUsers: Conversation["users"],
  loggedInUsers?: User | null
) => conversationUsers.find((userEmail) => userEmail !== loggedInUsers?.email);
