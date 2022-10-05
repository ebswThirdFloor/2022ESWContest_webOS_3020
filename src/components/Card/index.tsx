import React from "react";
import styled from "styled-components";
import Style from "./Card.module.css";

interface CardProps {
  bgcolor?: string;
  color?: string;
}

interface MainPanelProps extends CardProps, React.HTMLProps<HTMLElement> {}

const StyledDiv = styled.div<CardProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  padding: 50px;
  margin: 15px;
  width: 100%;
  background-color: ${(props) => props.bgcolor || "#ffffff"};
  color: ${(props) => props.color || "#000000"};
`;

const Card = (props: MainPanelProps) => {
  const { children, bgcolor, color, ...rest } = props;
  return (
    <section className={Style.wrapper} {...rest}>
      <StyledDiv bgcolor={bgcolor} color={color}>
        {children}
      </StyledDiv>
    </section>
  );
};

export default Card;
