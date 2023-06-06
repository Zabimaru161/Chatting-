import { db } from "@/config/firebase";
import { IMessage } from "@/types";
import { timeStamp } from "console";
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const generateQueryGetMessages = (conversationId?: string) =>
  query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationId),
    orderBy("sent_at", "asc")
  );

export const transformMessage = (
  message: QueryDocumentSnapshot<DocumentData>
) =>
  ({
    id: message.id,
    ...message.data(), //spread out conversation_id, text, sent_at, user
    sent_at: message.data().sent_at
      ? convertFirestoreTimestampToString(message.data().sent_at as Timestamp)
      : null,
  } as IMessage);

export const convertFirestoreTimestampToString = (timeStamp: Timestamp) =>
  new Date(timeStamp.toDate().getTime()).toLocaleString();
