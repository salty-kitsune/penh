import {
  Box,
  CircularProgress,
  Heading,
  Text,
  theme,
  useBoolean,
} from "@chakra-ui/react";
import { LegacyRef, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Message, MESSAGE_TYPE } from "../../../utils/message";
import { DecodeResult, DECODE_RESULT } from "../../../utils/decode";
import DetailPanel from "./DetailPanel";
import FailedPanel from "./FailedPanel";

const StyledBox = styled(Box)`
  width: 300px;
  min-height: 300px;
  font-size: 16px;

  display: flex;

  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  figure,
  p,
  pre {
    margin: 0;
  }

  ${DetailPanel}, ${FailedPanel} {
    flex-grow: 1;
  }

  ${FailedPanel} {
    place-self: center;
  }
`;

export interface PanelProps {
  text: string;
  containerRef?: LegacyRef<HTMLDivElement> | undefined;
}

const Panel = ({ text, containerRef }: PanelProps) => {
  const [isLoading, { off: setLoadingOff }] = useBoolean(true);
  const [result, setResult] = useState<DecodeResult | null>(null);

  useEffect(() => {
    if (window.chrome && text) {
      chrome.runtime.sendMessage(
        {
          type: MESSAGE_TYPE.REQUEST,
          payload: text,
        } as Message,
        (decodeResult: DecodeResult) => {
          setResult(decodeResult);
          setLoadingOff();
        }
      );
    }
  }, [text]);

  return (
    <StyledBox ref={containerRef} bg={theme.colors.gray[700]}>
      {isLoading ? (
        <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress isIndeterminate color="pink.400" />
        </Box>
      ) : result?.status === DECODE_RESULT.SUCCESS ? (
        <DetailPanel nuclearCode={text} data={result.data!} />
      ) : (
        <FailedPanel />
      )}
    </StyledBox>
  );
};

export default Panel;
