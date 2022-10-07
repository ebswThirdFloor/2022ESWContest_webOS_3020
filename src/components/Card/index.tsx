import React from "react";
import styled from "styled-components";
import Style from "./Card.module.css";

interface CardStyleProps {
  bgcolor?: string;
  color?: string;
  align_items?: string;
  justify_content?: string;
}

interface CardProps extends CardStyleProps, React.HTMLProps<HTMLElement> {}

const StyledDiv = styled.div<CardStyleProps>`
  display: flex;
  align-items: ${(props) => props.align_items || "center"};
  justify-content: ${(props) => props.justify_content || "center"};
  flex-direction: column;
  border-radius: 30px;
  padding: 50px;
  margin: 15px;
  width: 100%;
  background-color: ${(props) => props.bgcolor || "#ffffff"};
  color: ${(props) => props.color || "#000000"};
`;

const Card = (props: CardProps) => {
  const { children, bgcolor, color, align_items, justify_content, ...rest } = props;
  return (
    <section className={Style.wrapper} {...rest}>
      <StyledDiv bgcolor={bgcolor} color={color} align_items={align_items} justify_content={justify_content}>
        {children}
      </StyledDiv>
    </section>
  );
};

export default Card;
