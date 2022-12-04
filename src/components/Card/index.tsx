import React from "react";
import styled from "styled-components";

interface CardStyleProps {
  bgcolor?: string;
  color?: string;
  align_items?: string;
  justify_content?: string;
  border_radius?: string;
  flex?: number;
  margin?: string;
  padding?: string;
  flex_direction?: string;
}

interface CardProps extends CardStyleProps, React.HTMLProps<HTMLElement> {}

const StyledDiv = styled.div<CardStyleProps>`
  display: flex;
  flex: ${(props) => props.flex || 1};
  align-items: ${(props) => props.align_items || "center"};
  justify-content: ${(props) => props.justify_content || "center"};
  flex-direction: ${(props) => props.flex_direction || "column"};
  border-radius: ${(props) => props.border_radius || "15px"};
  margin: ${(props) => props.margin || "15px"};
  padding: ${(props) => props.padding};
  background-color: ${(props) => props.bgcolor || "#405cc9"};
  color: ${(props) => props.color || "#ffffff"};
`;

const Card = (props: CardProps) => {
  const { children, bgcolor, color, align_items, justify_content, ...rest } = props;
  return (
    <section {...rest}>
      <StyledDiv bgcolor={bgcolor} color={color} align_items={align_items} justify_content={justify_content}>
        {children}
      </StyledDiv>
    </section>
  );
};

export default Card;
