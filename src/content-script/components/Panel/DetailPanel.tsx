import {
  Box,
  Heading,
  theme,
  Tag,
  Link,
  TagLabel,
  Button,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useMemo } from 'react';
import {
  DecodeData,
  deserializeArrayBufferFromJSON,
} from '../../../utils/decode';
import { NUCLEAR_HOST } from '../../../utils/isNuclearCode';

interface DetailPanelProps {
  nuclearCode: string;
  data: DecodeData;
  className?: string;
}

const StyledHeading = styled(Heading)``;
const StyledButton = styled(Button)``;

const _DetailPanel = ({
  nuclearCode,
  data: { cover, subtitle, tags, title },
  className,
}: DetailPanelProps) => {
  const imageSource = useMemo(() => {
    const { data } = cover;
    const { data: buffer } = deserializeArrayBufferFromJSON(data);
    return URL.createObjectURL(new Blob([buffer]));
  }, [cover]);

  return (
    <Box className={className}>
      <img src={imageSource} alt={title.pretty} />

      <Box className="info">
        <StyledHeading size="md">
          <span>{title.before}</span>
          <span>{title.pretty}</span>
          <span>{title.after}</span>
        </StyledHeading>
        <StyledHeading size="sm">
          <span>{subtitle.before}</span>
          <span>{subtitle.pretty}</span>
          <span>{subtitle.after}</span>
        </StyledHeading>

        <Box className="info__tags">
          {tags.map((tag) => (
            <Tag
              key={tag.name}
              as={Link}
              href={tag.href}
              target="_blank"
              rel="noopener"
              size="md"
              _hover={{
                textDecoration: 'none',
              }}
            >
              <TagLabel>{tag.name}</TagLabel>
            </Tag>
          ))}
        </Box>

        <StyledButton
          as={Link}
          colorScheme="pink"
          size="lg"
          href={`${NUCLEAR_HOST}/g/${nuclearCode}`}
          target="_blank"
          rel="noopener"
          _hover={{
            textDecoration: 'none',
          }}
        >
          Visit
        </StyledButton>
      </Box>
    </Box>
  );
};

const DetailPanel = styled(_DetailPanel)`
  height: 500px;
  position: relative;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & > .info {
    color: white;
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    padding: 0.5em;
    display: flex;
    flex-direction: column;

    background: linear-gradient(transparent, black);

    & > ${StyledHeading} {
      filter: drop-shadow(0px 2px 4px black);

      & > span {
        &:nth-child(1),
        &:nth-child(3) {
          color: ${theme.colors.gray[200]};
        }
      }
    }

    & > .info__tags {
      margin-top: 0.5em;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
      max-height: 200px;
      overflow: hidden auto;

      &::-webkit-scrollbar {
        width: 8px;
        border-radius: 4px;
        background-color: rgb(0 0 0 / 10%);
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgb(0 0 0 / 20%);
        border-radius: 4px;
      }
    }

    & > ${StyledButton} {
      margin-top: 0.5em;
    }
  }
`;

export default DetailPanel;
