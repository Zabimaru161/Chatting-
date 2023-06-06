import { useRecipient } from "@/hooks/useRecipient";
import { Conversation, IMessage } from "@/types";
import styled from "styled-components";
import RecipientAvatar from "./RecipientAvatar";
import {
  convertFirestoreTimestampToString,
  generateQueryGetMessages,
  transformMessage,
} from "@/utils/getMessagesInConversation";
import { IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useRef,
  useState,
} from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const StyledRecipientHeader = styled.div`
  background-color: white;
  z-index: 0;
  position: sticky;
  display: flex;
  align-items: center;
  padding: 11px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const StyledHeaderInfo = styled.div`
  flex-grow: 1;
  > h3 {
    margin-top: 0%;
    margin-bottom: 3%;
  }
  > span {
    font-size: 14px;
    color: gray;
  }
`;
const StyledH3 = styled.h3`
  word-break: break-all;
`;
const StyledHeaderIcons = styled.div`
  display: flex;
`;

const StyledMessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
`;
const StyledInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const ConversationScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation;
  messages: IMessage[];
}) => {
  const addMessageToDbUpdateLastSeen = async () => {
    // update last seen in 'users' collection
    await setDoc(
      doc(db, "users", loggedInUser?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    ); //just update what is change
    //add new message to 'messages' collection
    await addDoc(collection(db, "messages"), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMessage,
      user: loggedInUser?.email,
    });
    //reset input filed
    setNewMessage("");
    //scroll to bottom
    scrollToBottom();
  };
  const EndofMessagesForAutoScroll = styled.div`
    margin-bottom: 30px;
  `;
  const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    if (!newMessage) return;
    addMessageToDbUpdateLastSeen();
  };
  const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!newMessage) return;
      addMessageToDbUpdateLastSeen();
    }
  };
  const [newMessage, setNewMessage] = useState("");
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const conversationUsers = conversation.users;
  const { recipientEmail, recipient } = useRecipient(conversationUsers);
  const router = useRouter();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const conversationId = router.query.id; // localhost:3000/convsersations/:id
  const queryGetMessages = generateQueryGetMessages(conversationId as string);
  const [messagesSnapshot, messagesLoading, __error] =
    useCollection(queryGetMessages);
  const showMessages = () => {
    // if FE is loading messages behind the scene, display messages retrived from next SSR ( passed down from [id].tsx)
    if (messagesLoading) {
      return messages.map((message) => (
        <Message key={message.id} message={message} />
      ));
    }
    // if FE has finished loading messages, so now we have messagesSnapshot
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message key={message.id} message={transformMessage(message)} />
      ));
    }
    return null;
  };

  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
        <StyledHeaderInfo>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && (
            <span>
              Last active:{" "}
              {convertFirestoreTimestampToString(recipient.lastseen)}
            </span>
          )}
        </StyledHeaderInfo>
        <StyledHeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </StyledHeaderIcons>
      </StyledRecipientHeader>
      <StyledMessageContainer>
        {showMessages()}
        {/* for auto scroll to the end when a new message is sent */}
        <EndofMessagesForAutoScroll ref={endOfMessagesRef} />
      </StyledMessageContainer>

      <StyledInputContainer>
        <InsertEmoticonIcon />
        <StyledInput
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={sendMessageOnEnter}
        />
        <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
};

export default ConversationScreen;
