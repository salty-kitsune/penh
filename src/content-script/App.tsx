import { useEffect, useRef, useState } from 'react';
import {
  useDisclosure,
  Box,
  Popover,
  Portal,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { isWhitespaceCharacter } from 'is-whitespace-character';
import Panel from './components/Panel';
import isNuclearCode from '../utils/isNuclearCode';
import getHighestZindex from '../utils/getHighestZIndex';

const App = () => {
  const [text, setText] = useState('');
  const [zIndex, setZIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const popperRefTemp = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const handleOnPointerUp = (ev: PointerEvent) => {
    const selection = window.getSelection();
    const selectionText = selection?.toString();

    if (
      !selectionText ||
      isWhitespaceCharacter(selectionText) ||
      !isNuclearCode(selectionText.trim()) ||
      (ev as any).path.includes(popperRefTemp.current)
    )
      return;

    const { height, width, x, y } = selection!
      .getRangeAt(0)
      .getBoundingClientRect();
    const highestZIndex = getHighestZindex();

    setPosition({ height, width, x, y });
    setZIndex(highestZIndex + 10);
    setText(selectionText!);
    onOpen();
  };

  const handleOnPointerDown = (ev: PointerEvent) => {
    if ((ev as any).path.includes(popperRefTemp.current)) return;

    window.getSelection()?.removeAllRanges();
    if (isOpen) onClose();
    setText('');
    ev.stopPropagation();
  };

  useEffect(() => {
    document.addEventListener('pointerup', handleOnPointerUp);
    document.addEventListener('pointerdown', handleOnPointerDown);

    return () => {
      document.removeEventListener('pointerup', handleOnPointerUp);
      document.removeEventListener('pointerdown', handleOnPointerDown);
    };
  }, [isOpen]);

  return (
    <Portal>
      <Popover isOpen={isOpen} isLazy>
        {() => (
          <>
            <PopoverTrigger>
              <Box
                position="absolute"
                top={`calc(${position.y}px + ${window.scrollY}px + 1rem / 2)`}
                left={position.x + position.width / 2}
              />
            </PopoverTrigger>

            <PopoverContent
              ref={popperRefTemp}
              border="none"
              width="auto"
              overflow="hidden"
              background="none"
              zIndex={zIndex || 'auto'}
              _focus={{
                boxShadow: 'none',
              }}
              _focusVisible={{
                outline: 'none',
              }}
            >
              <Panel text={text} />
            </PopoverContent>
          </>
        )}
      </Popover>
    </Portal>
  );
};

export default App;
