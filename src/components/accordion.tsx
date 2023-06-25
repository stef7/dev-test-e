import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Heading } from "@chakra-ui/react";
import { useLayoutEffect, useRef } from "react";
import { useMeasure } from "react-use";

import styles from "./accordion.module.css";

type AccordionChild = { buttonText: React.ReactNode; node: React.ReactNode; key: React.Key; groupByValue: unknown };

const AccordionItemWithSticky: React.FC<AccordionChild> = ({ buttonText, node }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [buttonRef, { height }] = useMeasure<HTMLButtonElement>();
  useLayoutEffect(() => {
    itemRef.current?.style.setProperty("--accordion-button-height", `${height}px`);
  }, [height]);

  return (
    <AccordionItem ref={itemRef} pos="relative" data-testid="accordion-item">
      <AccordionButton
        padding={0}
        ref={buttonRef}
        pos="sticky"
        top={0}
        zIndex="sticky"
        bgColor="var(--chakra-colors-chakra-subtle-bg) !important"
        textAlign="inherit"
      >
        <Heading fontSize="lg" padding={4} paddingY={3} display="flex" alignItems="top">
          <AccordionIcon />
          {buttonText}
        </Heading>
      </AccordionButton>
      <AccordionPanel padding={0} motionProps={{ className: styles["panel"] }}>
        {node}
      </AccordionPanel>
    </AccordionItem>
  );
};

export const AccordionOptional: React.FC<{ children: AccordionChild[] }> = ({ children }) => {
  if (children.length < 2 && !children[0]?.groupByValue) return children[0]?.node;
  return (
    <Accordion allowMultiple data-testid="accordion">
      {children.map((item) => (
        <AccordionItemWithSticky {...item} key={item.key} />
      ))}
    </Accordion>
  );
};
