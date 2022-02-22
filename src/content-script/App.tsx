import { useEffect, useRef, useState } from "react";
import {
  usePopper,
  useDisclosure,
  Box,
  Popover,
  Portal,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { isWhitespaceCharacter } from "is-whitespace-character";
import Panel from "./components/Panel";
import isNuclearCode from "../utils/isNuclearCode";

const App = () => {
  const [text, setText] = useState("");
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

    const bcr = selection!.getRangeAt(0).getBoundingClientRect();
    setPosition({
      height: bcr.height,
      width: bcr.width,
      x: bcr.x,
      y: bcr.y,
    });

    setText(selectionText!);
    onOpen();
  };

  const handleOnPointerDown = (ev: PointerEvent) => {
    if ((ev as any).path.includes(popperRefTemp.current)) return;

    window.getSelection()?.removeAllRanges();
    if (isOpen) onClose();
    setText("");
    ev.stopPropagation();
  };

  useEffect(() => {
    document.addEventListener("pointerup", handleOnPointerUp);
    document.addEventListener("pointerdown", handleOnPointerDown);

    return () => {
      document.removeEventListener("pointerup", handleOnPointerUp);
      document.removeEventListener("pointerdown", handleOnPointerDown);
    };
  }, [isOpen]);

  return (
    <Portal>
      <Popover isOpen={isOpen} isLazy>
        {({}) => (
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
              _focus={{
                boxShadow: "none",
              }}
              _focusVisible={{
                outline: "none",
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
