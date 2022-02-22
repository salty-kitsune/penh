import { Box, Heading, Text, Link } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";

interface FailedPanelProps {
  className?: string;
}

const FailedPanel = ({ className }: FailedPanelProps) => {
  return (
    <Box className={className}>
      <WarningTwoIcon color="pink.400" fontSize="62px" />
      <Heading textAlign="center" mb="0.5em">
        Failed to Fetch
      </Heading>
      <Text textAlign="center">
        Make sure the connection to{" "}
        <Link color="pink.400" href="https://nhentai.net">
          NHentai
        </Link>{" "}
        is not being blocked.
      </Text>
      <Text textAlign="center">
        You can use VPN or enable{" "}
        <Link
          color="pink.400"
          href="https://developers.cloudflare.com/1.1.1.1/encrypted-dns/dns-over-https/encrypted-dns-browsers#google-chrome"
        >
          DNS over HTTPS
        </Link>{" "}
        in the browser.
      </Text>
    </Box>
  );
};

export default styled(FailedPanel)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: 0.5em;
`;
