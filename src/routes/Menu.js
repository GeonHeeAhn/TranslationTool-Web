import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <Container>
      <Link to="/student">
        <Button>학생용</Button>
      </Link>
      <Link to="/professor">
        <Button>교수용</Button>
      </Link>
    </Container>
  );
};

export default Menu;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
  width: 350px;
  height: 450px;
`;

const Button = styled.button`
  margin-bottom: 30px;
  background: #f9f9f9;
  border-radius: 100px;
  width: 180px;
  height: 3.5rem;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: center;
  color: grey;
  border: none;
  :hover {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.07);
    color: black;
  }
`;
