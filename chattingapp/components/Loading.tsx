import styled from "styled-components";
import Image from "next/image";
import WhatsAppLogo from "../Tamarin/T.jpg";
import { CircularProgress } from "@mui/material";

const StyledConatiner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;

const Loading = () => {
  return (
    <StyledConatiner>
      <StyledImageWrapper>
        <Image
          src={WhatsAppLogo}
          alt="whatsApp Logo"
          height="200"
          width="200"
        />
      </StyledImageWrapper>

      <CircularProgress />
    </StyledConatiner>
  );
};

export default Loading;
